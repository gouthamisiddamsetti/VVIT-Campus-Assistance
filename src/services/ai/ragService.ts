import { Facility, Building, ChatMessage } from '../../types/campus';
import { searchCampus } from '../search/searchEngine';

export interface GroundedAIResponse {
  answer: string;
  matchedFacilities: Array<{
    id: string;
    canonicalName: string;
    buildingName: string | null;
    verificationStatus: 'pending' | 'verified' | 'needs_correction' | 'archived';
  }>;
  clarificationOptions?: string[];
  isFallback?: boolean;
}

/**
 * Deterministic grounding engine that evaluates queries against verified campus records
 * and provides strict anti-hallucination guardrails adhering to section 7 & 14.
 */
export function generateGroundedCampusAnswer(
  query: string,
  facilities: Facility[],
  buildings: Building[]
): GroundedAIResponse {
  const q = query.trim().toLowerCase();

  // 1. Specific Disambiguation: OAT (Outdoor OAT vs Student Hub in Truth Block)
  if ((q.includes('oat') || q.includes('open air')) && !q.includes('outdoor') && !q.includes('truth') && !q.includes('student hub')) {
    const outdoorOat = facilities.find(f => f.id === 'fac-outdoor-oat');
    const studentHub = facilities.find(f => f.id === 'fac-student-hub-truth');
    return {
      answer: "The directory lists an outdoor OAT between Loyalty Blocks 2 and 3 and an enclosed Student Hub inside Truth Block. Which one do you mean?",
      matchedFacilities: [
        {
          id: outdoorOat?.id || 'fac-outdoor-oat',
          canonicalName: 'Outdoor Open Air Theatre (OAT)',
          buildingName: 'Between Loyalty Blocks 2 and 3',
          verificationStatus: outdoorOat?.verificationStatus || 'pending'
        },
        {
          id: studentHub?.id || 'fac-student-hub-truth',
          canonicalName: 'Student Hub (Truth Block)',
          buildingName: 'Truth Block',
          verificationStatus: studentHub?.verificationStatus || 'pending'
        }
      ],
      clarificationOptions: ['Outdoor OAT (Between Loyalty 2 & 3)', 'Student Hub (Inside Truth Block)']
    };
  }

  // 2. Specific Query: Washroom / Nearest Washroom
  if (q.includes('washroom') || q.includes('restroom') || q.includes('toilet')) {
    const washroom = facilities.find(f => f.id === 'fac-washrooms');
    return {
      answer: "Washrooms are reported to be available in all blocks. Which block are you near? I can help narrow down the location.",
      matchedFacilities: washroom ? [{
        id: washroom.id,
        canonicalName: washroom.canonicalName,
        buildingName: washroom.buildingName,
        verificationStatus: washroom.verificationStatus
      }] : [],
      clarificationOptions: [
        'Loyalty Block 1',
        'Loyalty Block 2',
        'Loyalty Block 3',
        'Loyalty Block 4',
        'Wisdom Block',
        'Honesty Block',
        'Truth Block'
      ]
    };
  }

  // 3. Specific Query: SAC Room
  if (q.includes('sac')) {
    const sac = facilities.find(f => f.id === 'fac-sac-room');
    return {
      answer: "The SAC Room is in Honesty Block, beside the Board Room. Its exact floor and room number have not yet been confirmed.",
      matchedFacilities: sac ? [{
        id: sac.id,
        canonicalName: sac.canonicalName,
        buildingName: sac.buildingName,
        verificationStatus: sac.verificationStatus
      }] : []
    };
  }

  // 4. Specific Query: Honesty Block Seminar Hall opposite Accounts
  if ((q.includes('seminar hall') && q.includes('accounts')) || (q.includes('seminar hall') && q.includes('honesty'))) {
    const hall = facilities.find(f => f.id === 'fac-honesty-seminar-hall');
    return {
      answer: "The Honesty Block Seminar Hall is located on the ground floor, opposite the Accounts Room. Its capacity and booking procedures remain unconfirmed.",
      matchedFacilities: hall ? [{
        id: hall.id,
        canonicalName: hall.canonicalName,
        buildingName: hall.buildingName,
        verificationStatus: hall.verificationStatus
      }] : []
    };
  }

  // 5. Specific Query: Library / Library Hours
  if (q.includes('library') || q.includes('books')) {
    const lib = facilities.find(f => f.id === 'fac-library');
    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('close')) {
      return {
        answer: "The University Central Library is located in Wisdom Block across both the 3rd and 4th floors. Opening hours have not yet been confirmed or published by university administration.",
        matchedFacilities: lib ? [{
          id: lib.id,
          canonicalName: lib.canonicalName,
          buildingName: lib.buildingName,
          verificationStatus: lib.verificationStatus
        }] : []
      };
    }
    return {
      answer: "The University Central Library is located in Wisdom Block on both the 3rd and 4th floors. Specific section layouts and opening hours are pending independent verification.",
      matchedFacilities: lib ? [{
        id: lib.id,
        canonicalName: lib.canonicalName,
        buildingName: lib.buildingName,
        verificationStatus: lib.verificationStatus
      }] : []
    };
  }

  // 6. Specific Query: Mess / Mess Timings
  if (q.includes('mess') || q.includes('canteen') || q.includes('food') || q.includes('dining')) {
    const mess = facilities.find(f => f.id === 'fac-mess');
    return {
      answer: "The campus mess is located between Loyalty Blocks 2 and 3. Reported daily lunch timings are 12:00 PM to 1:30 PM. Breakfast timings, dinner timings, menus, and prices have not been confirmed.",
      matchedFacilities: mess ? [{
        id: mess.id,
        canonicalName: mess.canonicalName,
        buildingName: mess.buildingName,
        verificationStatus: mess.verificationStatus
      }] : []
    };
  }

  // 7. Specific Query: Medical Room / First Aid
  if (q.includes('medical') || q.includes('first aid') || q.includes('clinic') || q.includes('doctor') || q.includes('nurse')) {
    const med = facilities.find(f => f.id === 'fac-medical-room');
    return {
      answer: "The Medical Room is listed on the ground floor of Loyalty Block 4. Its exact room number, operational timings, and emergency contact numbers are pending confirmation.",
      matchedFacilities: med ? [{
        id: med.id,
        canonicalName: med.canonicalName,
        buildingName: med.buildingName,
        verificationStatus: med.verificationStatus
      }] : []
    };
  }

  // 8. Specific Query: Examination Cell
  if (q.includes('exam') || q.includes('examination')) {
    const exam = facilities.find(f => f.id === 'fac-exam-cell');
    return {
      answer: "The Examination Cell is located in Loyalty Block 2. Its exact floor and room number have not yet been confirmed.",
      matchedFacilities: exam ? [{
        id: exam.id,
        canonicalName: exam.canonicalName,
        buildingName: exam.buildingName,
        verificationStatus: exam.verificationStatus
      }] : []
    };
  }

  // 9. Specific Query: Outdoor OAT specifically
  if (q.includes('outdoor oat') || (q.includes('oat') && q.includes('between'))) {
    const oat = facilities.find(f => f.id === 'fac-outdoor-oat');
    return {
      answer: "The outdoor OAT (Open Air Theatre) is located between Loyalty Blocks 2 and 3. Exact coordinates and seating capacity are unconfirmed.",
      matchedFacilities: oat ? [{
        id: oat.id,
        canonicalName: oat.canonicalName,
        buildingName: oat.buildingName,
        verificationStatus: oat.verificationStatus
      }] : []
    };
  }

  // 10. Specific Query: Student Hub specifically
  if (q.includes('student hub') || (q.includes('hub') && q.includes('truth'))) {
    const hub = facilities.find(f => f.id === 'fac-student-hub-truth');
    return {
      answer: "The Student Hub is an enclosed OAT-like facility located inside Truth Block, reported to be visible when entering the building. Note that this is distinct from the outdoor OAT between Loyalty Blocks 2 and 3.",
      matchedFacilities: hub ? [{
        id: hub.id,
        canonicalName: hub.canonicalName,
        buildingName: hub.buildingName,
        verificationStatus: hub.verificationStatus
      }] : []
    };
  }

  // 11. Specific Query: CSE
  if (q.includes('cse') || q.includes('computer science and engineering')) {
    const cse = facilities.find(f => f.id === 'fac-cse-branch');
    return {
      answer: "CSE is listed in Honesty Block. The exact room number and floor assignment have not yet been confirmed.",
      matchedFacilities: cse ? [{
        id: cse.id,
        canonicalName: cse.canonicalName,
        buildingName: cse.buildingName,
        verificationStatus: cse.verificationStatus
      }] : []
    };
  }

  // 12. Specific Query: Hostels / Girls' Hostels / Boys' Hostels
  if (q.includes('hostel') || q.includes('dorm')) {
    const hostel = facilities.find(f => f.id === 'fac-hostels');
    return {
      answer: "The university records report three (3) girls' hostels and two (2) boys' hostels. However, hostel names and individual locations have not been provided or verified.",
      matchedFacilities: hostel ? [{
        id: hostel.id,
        canonicalName: hostel.canonicalName,
        buildingName: hostel.buildingName,
        verificationStatus: hostel.verificationStatus
      }] : []
    };
  }

  // 13. Specific Query: Staff Phone Numbers / Contact info
  if (q.includes('phone') || q.includes('contact') || q.includes('call') || q.includes('number')) {
    return {
      answer: "Staff and faculty phone numbers have not been officially published in the campus directory. Please contact the Administration Block in Wisdom Block for authorized inquiries.",
      matchedFacilities: [],
      isFallback: true
    };
  }

  // 14. Specific Query: Parking / Bus Ground
  if (q.includes('parking') || q.includes('vehicle') || q.includes('bike') || q.includes('car')) {
    const parking = facilities.find(f => f.id === 'fac-parking');
    return {
      answer: "The campus parking area is reported to be at the Bus Ground. Exact boundaries, entrances, and vehicle capacity remain unconfirmed.",
      matchedFacilities: parking ? [{
        id: parking.id,
        canonicalName: parking.canonicalName,
        buildingName: parking.buildingName,
        verificationStatus: parking.verificationStatus
      }] : []
    };
  }

  // General RAG Search over campus facilities
  const searchResults = searchCampus(facilities, buildings, { query: query });
  if (searchResults.length > 0) {
    const top = searchResults[0].facility;
    let bldText = top.buildingName ? `in ${top.buildingName}` : 'at a campus location';
    if (top.floorLabel) {
      bldText += ` (${top.floorLabel})`;
    }

    const landmarkText = top.nearbyLandmarks.length > 0
      ? ` Nearby landmark: ${top.nearbyLandmarks[0]}.`
      : '';

    const unknownText = top.unknownDetails.length > 0
      ? ` Note: ${top.unknownDetails[0]}.`
      : '';

    const answer = `${top.canonicalName} is listed ${bldText}.${landmarkText}${unknownText}`;

    return {
      answer,
      matchedFacilities: searchResults.slice(0, 3).map(r => ({
        id: r.facility.id,
        canonicalName: r.facility.canonicalName,
        buildingName: r.facility.buildingName,
        verificationStatus: r.facility.verificationStatus,
      }))
    };
  }

  // Fallback when no database records match
  return {
    answer: "I couldn't find confirmed campus information matching that query in the VVITU directory. To avoid misinformation, unverified details are not generated. You can browse the Explore Campus directory or submit a location suggestion.",
    matchedFacilities: [],
    isFallback: true
  };
}
