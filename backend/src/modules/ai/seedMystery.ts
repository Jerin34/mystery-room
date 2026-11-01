import { GeneratedMysteryCase } from './schema';
import { GeneratePromptOptions } from './prompts';

export function generateSeedMystery(options: GeneratePromptOptions): GeneratedMysteryCase {
  const isDetailed = options.evidenceIntensity === 'DETAILED';
  const theme = options.theme || 'LOCKED_ROOM';

  if (theme === 'THEFT' || options.premise.toLowerCase().includes('diamond') || options.premise.toLowerCase().includes('theft')) {
    return {
      schemaVersion: '1.0',
      title: 'The Stolen Star of Kensington',
      setting: 'Lord Harrington\'s Private Manor Study, Sussex',
      incidentSummary: 'At 11:15 PM during an electrical storm, the priceless "Star of Kensington" sapphire vanished from a vault locked from the inside. Four guests and staff were in the estate.',
      suspects: [
        {
          id: 'suspect_01',
          name: 'Arthur Vance',
          occupation: 'Private Art Appraiser & Antiquarian',
          relationshipToIncident: 'Appraised the sapphire three hours prior to its disappearance',
          publicStatement: 'I was in the guest library reading 17th-century manuscripts from 10:30 PM until the alarm sounded.',
          motiveSummary: 'Facing bankruptcy from failed investments in fraudulent European antiquities.',
          alibiSummary: 'Claims to have been in the library alone, but the fireplace was cold.',
          avatarPrompt: 'Distinguished man in his 50s with wire-rimmed glasses and silver temples.'
        },
        {
          id: 'suspect_02',
          name: 'Elena Rostova',
          occupation: 'Security Systems Consultant',
          relationshipToIncident: 'Configured the vault\'s biometric and dual-key locks last month',
          publicStatement: 'I was troubleshooting the estate server in the basement after the storm caused a voltage spike.',
          motiveSummary: 'Was dismissed by Harrington last week over billing disputes.',
          alibiSummary: 'Server log timestamps corroborate her presence in the server room.',
          avatarPrompt: 'Sharp woman in her 30s in tech attire with an RFID badge lanyard.'
        },
        {
          id: 'suspect_03',
          name: 'Cedric Wells',
          occupation: 'Lord Harrington\'s Personal Butler',
          relationshipToIncident: 'Held the only master physical key to the inner chamber doors',
          publicStatement: 'I was preparing evening tea in the pantry and attending to Lord Harrington.',
          motiveSummary: 'Owed substantial gambling debts to a local syndicate.',
          alibiSummary: 'Pantry logs show kettle usage at 11:10 PM.',
          avatarPrompt: 'Elderly butler in formal livery with a stoic demeanor.'
        },
        {
          id: 'suspect_04',
          name: 'Marcus Vance',
          occupation: 'Nephew of Arthur Vance & Collector',
          relationshipToIncident: 'Accompanied Arthur to the estate; stayed in the West Wing',
          publicStatement: 'I was asleep in my quarters after drinking brandy.',
          motiveSummary: 'Looking for fast collateral to secure an auction bid.',
          alibiSummary: 'Heard pacing in his room by the housekeeper at 11:00 PM.',
          avatarPrompt: 'Young man in a tweed jacket looking nervous.'
        }
      ],
      canonicalCulpritId: 'suspect_01',
      timeline: [
        { id: 'event_01', timeLabel: '10:00 PM', description: 'Lord Harrington verifies the sapphire is inside the locked vault.', visibility: 'PUBLIC' },
        { id: 'event_02', timeLabel: '10:45 PM', description: 'Thunderstorm causes a 90-second localized power surge.', visibility: 'PUBLIC' },
        { id: 'event_03', timeLabel: '11:12 PM', description: 'Vault seismic sensor triggers silent alert.', visibility: 'PUBLIC' },
        { id: 'event_04', timeLabel: '11:15 PM', description: 'Lord Harrington discovers the vault door ajar and sapphire missing.', visibility: 'PUBLIC' },
        { id: 'event_05', timeLabel: '11:20 PM', description: 'Estate grounds locked down; police notified.', visibility: 'PUBLIC' }
      ],
      evidence: [
        {
          id: 'evidence_01',
          type: 'MESSAGE',
          title: 'Encrypted Message Fragment',
          sourceLabel: 'Interpreted from a burner phone found in the conservatory',
          occurredAtLabel: '10:18 PM',
          description: 'A text sent to an offshore fence inquiring about private transit.',
          content: 'SIMULATED CHAT LOG\n[10:18 PM] Sender: "Asset will be secured during the storm blackout. Prepare wire transfer to Swiss holding #99401."\n[10:19 PM] Recipient: "Confirmation required before midnight. Ensure no glass breakage."',
          visibility: 'PUBLIC',
          supports: ['event_02']
        },
        {
          id: 'evidence_02',
          type: 'ACCESS_LOG',
          title: 'Basement Server Room Access Log',
          sourceLabel: 'Main Security Terminal',
          occurredAtLabel: '10:42 PM - 11:18 PM',
          description: 'Digital swipe logs for the server room door.',
          content: 'SIMULATED ACCESS LOG\n10:42:15 PM - Keycard [ROSTOVA_E] - DOOR OPEN\n10:58:30 PM - Diagnostics ping initiated\n11:14:02 PM - Power relay switch toggled manually\n11:18:45 PM - Keycard [ROSTOVA_E] - DOOR CLOSE',
          visibility: 'PUBLIC',
          supports: ['event_02']
        },
        {
          id: 'evidence_03',
          type: 'DOCUMENT',
          title: 'Library Dust Examination & Fireplace Report',
          sourceLabel: 'Forensic Officer\'s Field Notes',
          occurredAtLabel: '11:45 PM',
          description: 'Observations regarding Arthur Vance\'s claimed reading spot.',
          content: 'The armchair in the library had thick undisturbed dust on its armrests. The grate of the fireplace was ice cold, and the 17th-century folio on the desk was bookmarked at Chapter 1 without fingerprints. Muddy shoe impressions matching size 10 Oxfords led towards the study service door.',
          visibility: 'PUBLIC',
          supports: ['event_03']
        },
        {
          id: 'evidence_04',
          type: 'WITNESS',
          title: 'Housekeeper Interview Transcript',
          sourceLabel: 'Police Interrogation Room',
          occurredAtLabel: '11:55 PM',
          description: 'Statement by Mrs. Gable regarding suspect movements.',
          content: 'OFFICER: "Did you observe anyone near the study corridor?"\nMRS. GABLE: "Around 11:05 PM, I saw Mr. Arthur Vance carrying his leather briefcase towards the study. When I greeted him, he startled and quickly hid something in his coat pocket, claiming he needed to check the atmospheric humidity for the appraisal."',
          visibility: 'PUBLIC'
        },
        {
          id: 'evidence_05',
          type: 'DOCUMENT',
          title: 'Appraisal Kit Inventory',
          sourceLabel: 'Crime Scene Evidence Bag #4',
          occurredAtLabel: 'Midnight',
          description: 'Contents of Arthur Vance\'s professional appraisal case.',
          content: 'Items seized: Precision jeweler loupe, micro-suction glass lifter (with rubber residue matching the vault display case), duplicate brass skeleton key fitted with wax impressions of Harrington\'s lock, and an airline ticket to Zurich scheduled for 6:00 AM.',
          visibility: 'PUBLIC'
        },
        {
          id: 'evidence_06',
          type: 'RECORDING',
          title: 'Conservatory CCTV Audio Log Transcript',
          sourceLabel: 'Audio Sensor #3',
          occurredAtLabel: '11:11 PM',
          description: 'Surveillance audio transcript recorded outside the study patio.',
          content: 'SIMULATED AUDIO TRANSCRIPT\n[11:11:04] (Heavy rain against glass)\n[11:11:42] (Sound of latch clicking gently)\n[11:12:10] Male voice whispering: "Easy does it... velvet bag is secure."\n[11:12:35] (Rapid footsteps receding towards guest quarters)',
          visibility: 'PUBLIC'
        },
        ...(isDetailed
          ? [
              {
                id: 'evidence_07',
                type: 'DOCUMENT' as const,
                title: 'Cedric Wells\' Betting Ledger',
                sourceLabel: 'Butler\'s Quarters Drawer',
                occurredAtLabel: '10:00 PM',
                description: 'Record of Cedric Wells\' gambling arrears.',
                content: 'Debt of £12,000 paid in full by certified cashier\'s check yesterday morning from Cedric\'s legitimate inheritance liquidation, confirmed by probate attorneys.',
                visibility: 'PUBLIC' as const
              },
              {
                id: 'evidence_08',
                type: 'MESSAGE' as const,
                title: 'Elena Rostova Diagnostics Log SMS',
                sourceLabel: 'Elena\'s Tablet',
                occurredAtLabel: '11:15 PM',
                description: 'Automatic system ping received while in the server room.',
                content: 'SYSTEM PING: Relay 4 active. Backup battery operating normally.',
                visibility: 'PUBLIC' as const
              }
            ]
          : [])
      ],
      solution: {
        motive: 'Arthur Vance was hopelessly indebted due to failed black-market antiquity dealings and forged an emergency escape plan using Harrington\'s sapphire.',
        reasoning: 'Arthur Vance lied about being in the library reading manuscripts—forensics proved the library seat was covered in undisturbed dust and the manuscript was untouched (evidence_03). The housekeeper witnessed him carrying his briefcase into the study right before the theft (evidence_04). The appraisal kit in his possession contained a micro-suction glass lifter matching the vault case and a flight ticket to Zurich (evidence_05). The audio transcript recorded him escaping with the velvet pouch at 11:12 PM (evidence_06).',
        reconstructedTimeline: [
          '10:18 PM - Vance coordinates via burner phone with his Zurich buyer (evidence_01).',
          '10:45 PM - Vance uses the lightning power fluctuation to sneak towards the study.',
          '11:05 PM - Housekeeper spots Vance near the study with his appraisal kit (evidence_04).',
          '11:12 PM - Vance lifts the vault glass with his suction tool, bags the sapphire, and flees (evidence_05, evidence_06).',
          '11:15 PM - Harrington discovers the open vault; Vance pretends to join the search.'
        ],
        evidenceReferences: ['evidence_03', 'evidence_04', 'evidence_05', 'evidence_06'],
        redHerringExplanations: [
          'Elena Rostova had motive due to her termination, but server room access logs and pings proved she remained in the basement continuously from 10:42 PM to 11:18 PM (evidence_02).',
          'Cedric Wells had gambling debts, but court documents proved they had already been paid the prior morning via legitimate inheritance (evidence_07).'
        ]
      }
    };
  }

  // Default locked room / sabotage mystery seed
  return {
    schemaVersion: '1.0',
    title: 'The Silent Cipher at Blackwood Manor',
    setting: 'Blackwood Estate Observatory & Library, Northumberland',
    incidentSummary: 'Dr. Alistair Finch, cryptographer and patent holder of a breakthrough quantum encryption key, was poisoned during a private midnight meeting. The prototype drive has been wiped.',
    suspects: [
      {
        id: 'suspect_01',
        name: 'Dr. Evelyn Cross',
        occupation: 'Research Partner & Co-Inventor',
        relationshipToIncident: 'Argued publicly with Dr. Finch earlier in the evening over patent credit',
        publicStatement: 'I left Alistair around 11:00 PM after our discussion. I went directly to the darkroom to develop spectrograph plates.',
        motiveSummary: 'Finch intended to sell the patent exclusively to a defense conglomerate, cutting Cross out.',
        alibiSummary: 'Claims to have spent 11:00 PM to midnight developing film in the chemical darkroom.',
        avatarPrompt: 'Sharp-eyed scientist in laboratory coat with chemically stained fingers.'
      },
      {
        id: 'suspect_02',
        name: 'Julian Sterling',
        occupation: 'Venture Capitalist & Investor',
        relationshipToIncident: 'Arrived uninvited at the estate demanding an audit of the quantum drive',
        publicStatement: 'I spent the entire hour between 11:15 PM and 12:15 AM on a transatlantic conference call in the guest parlor.',
        motiveSummary: 'Stood to lose millions if Finch\'s prototype failed impending compliance standards.',
        alibiSummary: 'Phone records confirm a 45-minute conference call with Boston partners.',
        avatarPrompt: 'Sleek executive in charcoal tailored suit with a pocket watch.'
      },
      {
        id: 'suspect_03',
        name: 'Nadia Petrov',
        occupation: 'Lead Software Architect',
        relationshipToIncident: 'Maintained the terminal security protocols and held root keycard access',
        publicStatement: 'I was in the server annex running memory diagnostics until the alarm was sounded.',
        motiveSummary: 'Suspected by Finch of leaking algorithm schematics to international rivals.',
        alibiSummary: 'Server logs show active typing and terminal commands during the incident.',
        avatarPrompt: 'Focused programmer wearing headphones around neck and dark knit sweater.'
      }
    ],
    canonicalCulpritId: 'suspect_01',
    timeline: [
      { id: 'event_01', timeLabel: '10:30 PM', description: 'Dr. Finch and Dr. Cross argue vehemently over the quantum patent in the gallery.', visibility: 'PUBLIC' },
      { id: 'event_02', timeLabel: '11:15 PM', description: 'Dr. Finch requests herbal tea from the service kitchen.', visibility: 'PUBLIC' },
      { id: 'event_03', timeLabel: '11:40 PM', description: 'Terminal alert warns of a magnetic degaussing sequence wiping the prototype.', visibility: 'PUBLIC' },
      { id: 'event_04', timeLabel: '11:58 PM', description: 'Dr. Finch is found unconscious at his desk beside an overturned tea saucer.', visibility: 'PUBLIC' }
    ],
    evidence: [
      {
        id: 'evidence_01',
        type: 'WITNESS',
        title: 'Toxicology & Medical Assessment',
        sourceLabel: 'County Coroner Incident Report',
        occurredAtLabel: '12:20 AM',
        description: 'Analysis of the lethal agent present in Finch\'s teacup.',
        content: 'SIMULATED LAB REPORT\nSubstance identified: Potassium cyanide derivative blended with ferric ammonium citrate. This exact chemical combination is exclusively stocked in the darkroom photographic intensifier shelf.',
        visibility: 'PUBLIC',
        supports: ['event_04']
      },
      {
        id: 'evidence_02',
        type: 'MESSAGE',
        title: 'Internal Slack Dialogue Transcript',
        sourceLabel: 'Lab Network Backup',
        occurredAtLabel: '10:45 PM',
        description: 'Heated messages sent between Cross and Finch.',
        content: 'SIMULATED CHAT LOG\n[10:45:12] Dr. Cross: "You won\'t steal my decade of life\'s work, Alistair. Tonight ends this dispute one way or another."\n[10:46:01] Dr. Finch: "The board votes tomorrow. You have no veto power Evelyn. Pack your personal files."',
        visibility: 'PUBLIC',
        supports: ['event_01']
      },
      {
        id: 'evidence_03',
        type: 'DOCUMENT',
        title: 'Darkroom Chemical Log & Inspection',
        sourceLabel: 'Crime Scene Forensics',
        occurredAtLabel: '12:35 AM',
        description: 'Physical inspection of the darkroom where Cross claimed to be working.',
        content: 'The darkroom trays were completely dry. No photographic plates had been developed that evening. However, an amber reagent vial containing cyanide had its seal freshly broken, and a pair of latex gloves smelling of herbal peppermint tea was discarded in the chemical waste bin.',
        visibility: 'PUBLIC',
        supports: ['event_04']
      },
      {
        id: 'evidence_04',
        type: 'ACCESS_LOG',
        title: 'Observatory Magnetic Degausser Log',
        sourceLabel: 'Main Quantum Terminal',
        occurredAtLabel: '11:38 PM',
        description: 'System log recording manual activation of the wipe protocol.',
        content: 'SIMULATED ACCESS LOG\n11:38:04 PM - Manual degaussing initiated by physical key in slot B\nSlot B key assigned to: Dr. Evelyn Cross\n11:39:15 PM - Drive wiped successfully.',
        visibility: 'PUBLIC',
        supports: ['event_03']
      },
      {
        id: 'evidence_05',
        type: 'DOCUMENT',
        title: 'Julian Sterling Conference Call Transcript',
        sourceLabel: 'Telecom Provider Subpoena',
        occurredAtLabel: '11:15 PM - 12:00 AM',
        description: 'Verified teleconference audio logs with Boston investment group.',
        content: 'Telecom records show Sterling was actively speaking with partners across the entire 45-minute window with continuous audio and webcam stream verified from the parlor.',
        visibility: 'PUBLIC',
        supports: ['event_02']
      },
      {
        id: 'evidence_06',
        type: 'ACCESS_LOG',
        title: 'Nadia Petrov Terminal Session Stream',
        sourceLabel: 'Server Annex Keystroke Daemon',
        occurredAtLabel: '11:20 PM - 11:55 PM',
        description: 'Continuous command-line commit history.',
        content: 'Petrov committed 43 git updates and replied to automated server health alerts continuously throughout the window from terminal TTY-3.',
        visibility: 'PUBLIC'
      }
    ],
    solution: {
      motive: 'Dr. Evelyn Cross knew Dr. Finch was going to sell the quantum patent the next morning and strip her name and royalties. She poisoned his tea and destroyed the prototype drive with her assigned key.',
      reasoning: 'Dr. Cross\'s alibi about developing film in the darkroom was completely false—forensics found the trays dry and untouched, while the cyanide vial had a freshly broken seal and discarded gloves smelled of Finch\'s herbal tea (evidence_03). The poison was a unique photographic intensifier chemical mix (evidence_01). Furthermore, the magnetic wipe was executed using Dr. Cross\'s personal physical key in Slot B (evidence_04). Both Julian Sterling and Nadia Petrov had indisputable technical alibis (evidence_05, evidence_06).',
      reconstructedTimeline: [
        '10:45 PM - Cross threatens Finch after being excluded from the patent (evidence_02).',
        '11:15 PM - Finch orders herbal tea from the kitchen (event_02).',
        '11:25 PM - Cross intercepts the tea tray in the hallway, adding cyanide photographic intensifier from the darkroom (evidence_01, evidence_03).',
        '11:38 PM - Cross uses her Slot B physical key to initiate the degaussing sequence, wiping Finch\'s quantum drive (evidence_04).',
        '11:58 PM - Finch succumbs to the poison and is discovered by the night guard.'
      ],
      evidenceReferences: ['evidence_01', 'evidence_03', 'evidence_04'],
      redHerringExplanations: [
        'Julian Sterling had aggressive financial motives, but indisputable transatlantic conference logs confirmed his continuous presence in the parlor (evidence_05).',
        'Nadia Petrov had system access, but uninterrupted keystroke and commit logs exonerated her (evidence_06).'
      ]
    }
  };
}
