import { Facility, Building, SearchFilter } from '../../types/campus';

export interface SearchMatchResult {
  facility: Facility;
  matchedField: 'name' | 'alias' | 'building' | 'landmark' | 'category' | 'branch';
  matchedSnippet: string;
  score: number;
}

// Common natural-language filler words to strip when searching
const STOP_WORDS = new Set([
  'where', 'is', 'the', 'find', 'which', 'block', 'has', 'in', 'at', 'can', 'i', 'a',
  'an', 'to', 'room', 'department', 'dept', 'located', 'tell', 'me', 'about', 'nearest'
]);

// Branch and term alias dictionary for rapid normalization
const ABBREVIATION_MAP: Record<string, string[]> = {
  csm: ['csm', 'computer science and machine learning', 'cs&ml', 'machine learning'],
  civ: ['civ', 'civil', 'civil engineering'],
  aids: ['aids', 'ai&ds', 'ai and data science', 'artificial intelligence and data science'],
  eee: ['eee', 'triple e', 'electrical', 'electrical and electronics'],
  mech: ['mech', 'mechanical', 'mechanical engineering'],
  cai: ['cai', 'cs&ai', 'artificial intelligence', 'computer science and artificial intelligence'],
  it: ['it', 'information technology'],
  cse: ['cse', 'computer science', 'computer science and engineering'],
  cic: ['cic', 'computer science and information communication'],
  ece: ['ece', 'electronics', 'electronics and communication'],
  mtech: ['m.tech', 'mtech', 'masters'],
  oat: ['outdoor oat', 'student hub', 'open air theatre', 'amphitheatre'],
  sac: ['sac', 'sac room', 'student activity center'],
  vc: ['vc', 'vice chancellor'],
  exam: ['exam cell', 'examination cell', 'examination branch'],
  med: ['medical room', 'first aid', 'dispensary', 'clinic'],
};

export function normalizeQuery(query: string): string[] {
  const cleaned = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens;
}

export function searchCampus(
  facilities: Facility[],
  buildings: Building[],
  filter: SearchFilter
): SearchMatchResult[] {
  const rawQuery = (filter.query || '').trim();
  const queryTokens = normalizeQuery(rawQuery);
  const meaningfulTokens = queryTokens.filter(t => !STOP_WORDS.has(t));
  const effectiveTokens = meaningfulTokens.length > 0 ? meaningfulTokens : queryTokens;
  const rawLower = rawQuery.toLowerCase();

  const results: SearchMatchResult[] = [];

  for (const facility of facilities) {
    if (!facility.isPublished) continue;

    // Filter by category
    if (filter.category && filter.category !== 'all' && facility.category !== filter.category) {
      continue;
    }

    // Filter by building
    if (filter.buildingId && filter.buildingId !== 'all') {
      if (facility.buildingId !== filter.buildingId) continue;
    }

    // Filter by verification status
    if (filter.verificationStatus && filter.verificationStatus !== 'all') {
      if (facility.verificationStatus !== filter.verificationStatus) continue;
    }

    // If query is empty, return all matching filters with base score
    if (effectiveTokens.length === 0) {
      results.push({
        facility,
        matchedField: 'name',
        matchedSnippet: facility.canonicalName,
        score: 10,
      });
      continue;
    }

    let score = 0;
    let matchedField: SearchMatchResult['matchedField'] = 'name';
    let matchedSnippet = facility.canonicalName;

    const nameLower = facility.canonicalName.toLowerCase();
    const bldLower = (facility.buildingName || '').toLowerCase();
    const locLower = facility.locationDescription.toLowerCase();
    const aliasesLower = facility.aliases.map(a => a.toLowerCase());
    const landmarksLower = facility.nearbyLandmarks.map(l => l.toLowerCase());

    // 1. Exact string match against canonical name
    if (nameLower.includes(rawLower)) {
      score += 100;
      matchedField = 'name';
      matchedSnippet = facility.canonicalName;
    }

    // 2. Exact match against aliases
    for (const alias of aliasesLower) {
      if (alias === rawLower) {
        score += 90;
        matchedField = 'alias';
        matchedSnippet = alias;
        break;
      } else if (alias.includes(rawLower)) {
        score += 70;
        matchedField = 'alias';
        matchedSnippet = alias;
        break;
      }
    }

    // 3. Exact match against building name
    if (bldLower.includes(rawLower) && rawLower.length > 2) {
      score += 60;
      matchedField = 'building';
      matchedSnippet = facility.buildingName || '';
    }

    // 4. Token-based matching & abbreviation expansion
    for (const token of effectiveTokens) {
      // Direct token match in name
      if (nameLower.includes(token)) {
        score += 30;
      }

      // Direct token match in aliases
      for (const alias of aliasesLower) {
        if (alias.includes(token)) {
          score += 25;
          if (matchedField !== 'name') {
            matchedField = 'alias';
            matchedSnippet = alias;
          }
        }
      }

      // Check abbreviation mapping
      const expanded = ABBREVIATION_MAP[token];
      if (expanded) {
        for (const exp of expanded) {
          if (nameLower.includes(exp) || aliasesLower.some(a => a.includes(exp))) {
            score += 35;
          }
        }
      }

      // Check landmarks (e.g. "accounts", "board room")
      for (const lm of landmarksLower) {
        if (lm.includes(token)) {
          score += 20;
          if (score < 40) {
            matchedField = 'landmark';
            matchedSnippet = lm;
          }
        }
      }

      // Check location description
      if (locLower.includes(token)) {
        score += 15;
      }
    }

    // Special Disambiguation:
    // If user searched for "oat", both Outdoor OAT and Student Hub are relevant, but let's score both nicely
    if (rawLower.includes('oat')) {
      if (facility.id === 'fac-outdoor-oat') {
        score += 50;
      } else if (facility.id === 'fac-student-hub-truth') {
        score += 45;
      }
    }

    if (score > 0) {
      results.push({
        facility,
        matchedField,
        matchedSnippet,
        score,
      });
    }
  }

  // Sort by highest score first
  return results.sort((a, b) => b.score - a.score);
}
