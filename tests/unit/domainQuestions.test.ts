import { describe, it, expect } from 'vitest';
import { INITIAL_FACILITIES, INITIAL_BUILDINGS } from '../../src/data/initialCampusData';
import { generateGroundedCampusAnswer } from '../../src/services/ai/ragService';
import { searchCampus } from '../../src/services/search/searchEngine';
import { feedbackService } from '../../src/services/feedback/feedbackService';

describe('VVITU Campus Domain Requirements (Section 14)', () => {
  // Test 1: SAC Room returns Honesty Block, beside the Board Room.
  it('1. SAC Room returns Honesty Block, beside the Board Room', () => {
    const res = generateGroundedCampusAnswer('Where is the SAC Room?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Honesty Block');
    expect(res.answer).toContain('Board Room');
  });

  // Test 2: Honesty Block Seminar Hall returns ground floor, opposite Accounts Room.
  it('2. Honesty Block Seminar Hall returns ground floor, opposite Accounts Room', () => {
    const res = generateGroundedCampusAnswer('Where is the seminar hall opposite Accounts?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Honesty Block Seminar Hall');
    expect(res.answer).toContain('ground floor');
    expect(res.answer).toContain('opposite the Accounts Room');
  });

  // Test 3: Library returns Wisdom Block, 3rd and 4th floors.
  it('3. Library returns Wisdom Block, 3rd and 4th floors', () => {
    const res = generateGroundedCampusAnswer('Where is the library?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Wisdom Block');
    expect(res.answer).toContain('3rd and 4th floors');
  });

  // Test 4: Mess returns reported timings of 12:00 PM–1:30 PM daily.
  it('4. Mess returns reported timings of 12:00 PM–1:30 PM daily', () => {
    const res = generateGroundedCampusAnswer('What are the mess timings?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('12:00 PM to 1:30 PM');
    expect(res.answer.toLowerCase()).toContain('between loyalty blocks 2 and 3');
  });

  // Test 5: Medical Room returns Loyalty Block 4, ground floor.
  it('5. Medical Room returns Loyalty Block 4, ground floor', () => {
    const res = generateGroundedCampusAnswer('Where is the medical room?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Loyalty Block 4');
    expect(res.answer).toContain('ground floor');
  });

  // Test 6: Examination Cell returns Loyalty Block 2.
  it('6. Examination Cell returns Loyalty Block 2', () => {
    const res = generateGroundedCampusAnswer('Find the Examination Cell', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Loyalty Block 2');
  });

  // Test 7: Outdoor OAT returns between Loyalty Blocks 2 and 3.
  it('7. Outdoor OAT returns between Loyalty Blocks 2 and 3', () => {
    const res = generateGroundedCampusAnswer('Where is the outdoor OAT?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('between Loyalty Blocks 2 and 3');
  });

  // Test 8: Student Hub returns inside Truth Block.
  it('8. Student Hub returns inside Truth Block', () => {
    const res = generateGroundedCampusAnswer('Where is the Student Hub?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Truth Block');
    expect(res.answer).toContain('Student Hub');
  });

  // Test 9: CSE returns Honesty Block but does not invent a room number.
  it('9. CSE returns Honesty Block but does not invent a room number', () => {
    const res = generateGroundedCampusAnswer('Which block has CSE?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Honesty Block');
    expect(res.answer).toMatch(/not yet been confirmed|unconfirmed/i);
    expect(res.answer).not.toMatch(/room \d+/i);
  });

  // Test 10: Girls\' hostels returns the count of three without inventing their locations.
  it("10. Girls' hostels returns the count of three without inventing their locations", () => {
    const res = generateGroundedCampusAnswer('Tell me about hostels', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('three (3) girls');
    expect(res.answer).toContain('two (2) boys');
    expect(res.answer).toMatch(/not been provided|unconfirmed/i);
  });

  // Test 11: Unknown staff phone numbers are not fabricated.
  it('11. Unknown staff phone numbers are not fabricated', () => {
    const res = generateGroundedCampusAnswer('What is the phone number of the staff room?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toMatch(/not been officially published|unconfirmed/i);
    expect(res.answer).not.toMatch(/\+91|\d{10}/);
  });

  // Test 12: Unknown library hours are not fabricated.
  it('12. Unknown library hours are not fabricated', () => {
    const res = generateGroundedCampusAnswer('What are the opening hours of the library?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toMatch(/not yet been confirmed|unconfirmed/i);
    expect(res.answer).toContain('Wisdom Block');
  });

  // Test 13: The nearest-washroom question requests the user\'s starting block when necessary.
  it("13. The nearest-washroom question requests the user's starting block when necessary", () => {
    const res = generateGroundedCampusAnswer('Where is the nearest washroom?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('Which block are you near?');
    expect(res.clarificationOptions).toContain('Loyalty Block 1');
  });

  // Test 14: The OAT question distinguishes the outdoor OAT and the enclosed Student Hub.
  it('14. The OAT question distinguishes the outdoor OAT and the enclosed Student Hub', () => {
    const res = generateGroundedCampusAnswer('Where is the OAT?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toContain('outdoor OAT between Loyalty Blocks 2 and 3');
    expect(res.answer).toContain('Student Hub inside Truth Block');
    expect(res.answer).toContain('Which one do you mean?');
    expect(res.matchedFacilities.length).toBe(2);
  });

  // Test 15: SAC Room floor remains unknown until confirmed.
  it('15. SAC Room floor remains unknown until confirmed', () => {
    const sac = INITIAL_FACILITIES.find((f) => f.id === 'fac-sac-room');
    expect(sac?.floorLabel).toBeNull();
    expect(sac?.roomNumber).toBeNull();
    expect(sac?.unknownDetails.some((u) => u.includes('floor'))).toBe(true);

    const res = generateGroundedCampusAnswer('Where is the SAC Room?', INITIAL_FACILITIES, INITIAL_BUILDINGS);
    expect(res.answer).toMatch(/floor and room number have not yet been confirmed/i);
  });
});

describe('Search Engine Aliases & Robustness', () => {
  it('Resolves branch abbreviations accurately', () => {
    const csmResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'CSM' });
    expect(csmResults.length).toBeGreaterThan(0);
    expect(csmResults[0].facility.buildingName).toBe('Loyalty Block 1');

    const aidsResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'AIDS' });
    expect(aidsResults.length).toBeGreaterThan(0);
    expect(aidsResults[0].facility.buildingName).toBe('Loyalty Block 2');

    const civilResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'CIV' });
    expect(civilResults.length).toBeGreaterThan(0);
    expect(civilResults[0].facility.buildingName).toBe('Loyalty Block 2');

    const eeeResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'EEE' });
    expect(eeeResults.length).toBeGreaterThan(0);
    expect(eeeResults[0].facility.buildingName).toBe('Loyalty Block 3');

    const mechResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'MECH' });
    expect(mechResults.length).toBeGreaterThan(0);
    expect(mechResults[0].facility.buildingName).toBe('Loyalty Block 4');
  });

  it('Handles natural phrases like "where can I find a washroom?"', () => {
    const washroomResults = searchCampus(INITIAL_FACILITIES, INITIAL_BUILDINGS, { query: 'where can I find a washroom?' });
    expect(washroomResults.length).toBeGreaterThan(0);
    expect(washroomResults[0].facility.canonicalName).toContain('Washrooms');
  });

  it('Validates feedback submission text length', async () => {
    await expect(
      feedbackService.submitCorrection({ userSuggestedCorrection: 'hi' })
    ).rejects.toThrow(/minimum 5 characters/i);
  });

  it('Authenticates Master Admin (vvitu@ac.in / vvitu@123) with full permissions', async () => {
    const { authService } = await import('../../src/services/firebase/authService');
    const profile = await authService.login('vvitu@ac.in', 'vvitu@123');
    expect(profile.role).toBe('master_admin');
    expect(profile.email).toBe('vvitu@ac.in');
    expect(authService.hasPermission(profile.role, 'delete')).toBe(true);
    expect(authService.hasPermission(profile.role, 'manage_admins')).toBe(true);
  });
});

