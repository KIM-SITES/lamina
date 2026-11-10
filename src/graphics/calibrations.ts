export type CalibrationName = "discreta" | "moderada" | "expressiva";
export const calibrations = {
  discreta: { strength: 0.006, width: 0.1, wave: 0.0014, highlight: 0.025 },
  moderada: { strength: 0.013, width: 0.14, wave: 0.0023, highlight: 0.045 },
  expressiva: { strength: 0.026, width: 0.2, wave: 0.004, highlight: 0.075 },
} satisfies Record<
  CalibrationName,
  { strength: number; width: number; wave: number; highlight: number }
>;
