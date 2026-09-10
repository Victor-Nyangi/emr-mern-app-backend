/**
 * Authoritative unit/reference-range table for vital signs.
 *
 * This used to live in the frontend (types/vitals.d.ts + lib/vitalClassification.ts),
 * which put clinical unit and reference-range knowledge in the presentation layer.
 * It is now served from GET /api/v1/vitals/definitions so the frontend and any other
 * consumer (e.g. a FHIR facade) read a single copy.
 *
 * `range` stays structured ({ low, normal, high } numeric bounds), not a formatted
 * string -- it maps directly to FHIR's Observation.referenceRange.
 */

export type ItemRange = {
  min: number;
  max: number;
};

export type VitalRange = {
  low: ItemRange;
  normal: ItemRange;
  high: ItemRange;
};

export type LoincCoding = {
  system: string;
  code: string;
  display: string;
};

export type VitalDefinition = {
  name: string;
  label: string;
  unit: string;
  range: VitalRange;
  /** Omitted rather than guessed where a code can't be assigned with confidence. */
  loinc?: LoincCoding;
  /**
   * For panel-style vitals (currently only blood_pressure) whose stored value
   * decomposes into multiple FHIR Observation.component entries, each with its
   * own LOINC code.
   */
  components?: { name: string; loinc: LoincCoding }[];
};

const LOINC_SYSTEM = "http://loinc.org";

export const vitalDefinitions: VitalDefinition[] = [
  {
    name: "blood_pressure",
    label: "Blood Pressure",
    unit: "mmHg",
    range: {
      low: { min: 0, max: 89 }, // Hypotension (systolic < 90)
      normal: { min: 90, max: 119 }, // Normal (systolic 90-119)
      high: { min: 120, max: 180 }, // Hypertension (systolic >= 120)
    },
    loinc: {
      system: LOINC_SYSTEM,
      code: "85354-9",
      display: "Blood pressure panel",
    },
    components: [
      {
        name: "systolic",
        loinc: {
          system: LOINC_SYSTEM,
          code: "8480-6",
          display: "Systolic blood pressure",
        },
      },
      {
        name: "diastolic",
        loinc: {
          system: LOINC_SYSTEM,
          code: "8462-4",
          display: "Diastolic blood pressure",
        },
      },
    ],
  },
  {
    name: "pulse_rate",
    label: "Heart Rate",
    unit: "bpm",
    range: {
      low: { min: 0, max: 59 }, // Bradycardia (< 60 bpm)
      normal: { min: 60, max: 100 }, // Normal (60-100 bpm)
      high: { min: 101, max: 200 }, // Tachycardia (> 100 bpm)
    },
    loinc: {
      system: LOINC_SYSTEM,
      code: "8867-4",
      display: "Heart rate",
    },
  },
  {
    name: "body_temperature",
    label: "Temperature",
    unit: "°F",
    range: {
      low: { min: 90.0, max: 95.9 }, // Hypothermia
      normal: { min: 96.0, max: 99.5 }, // Normal body temp
      high: { min: 99.6, max: 106.0 }, // Fever or hyperthermia
    },
    loinc: {
      system: LOINC_SYSTEM,
      code: "8310-5",
      display: "Body temperature",
    },
  },
  {
    name: "respiration_rate",
    label: "Respiratory Rate",
    unit: "breaths/min",
    range: {
      low: { min: 0, max: 11 }, // Bradypnea (< 12)
      normal: { min: 12, max: 20 }, // Normal
      high: { min: 21, max: 40 }, // Tachypnea (> 20)
    },
    loinc: {
      system: LOINC_SYSTEM,
      code: "9279-1",
      display: "Respiratory rate",
    },
  },
  {
    name: "weight",
    label: "Weight",
    unit: "lbs",
    range: {
      low: { min: 0, max: 90 }, // Underweight for adults
      normal: { min: 91, max: 200 }, // General adult range
      high: { min: 201, max: 400 }, // Overweight/obese
    },
    loinc: {
      system: LOINC_SYSTEM,
      code: "29463-7",
      display: "Body weight",
    },
  },
];

export default vitalDefinitions;
