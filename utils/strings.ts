export const STRINGS = {
  // General
  TITLE: "Abduction",
  SUBTITLE: "Chaos at The Farm",

  // Loading
  LOADING: "Loading...",
  LOADING_PROGRESS: (percent: number) => `Loading... ${percent}%`,

  // HUD
  SCORE_PREFIX: "Score: ",
  HIGH_SCORE_PREFIX: "High Score: ",
  FUEL_LABEL: "GraviFuel",
  FUEL_WARNING: "Low Fuel! Drop to Recharge",
  FUEL_NORMAL: "Fly low to recharge",

  // Game Over
  GAME_OVER_TITLE: "Game Over",
  REASON_UFO: "Crashed",
  REASON_COW: "Bovine Lost",
  NEW_HIGH_SCORE: "New High Score!",

  // Buttons
  BTN_START: "Begin Abduction",
  BTN_RETRY: "Abduct Another",

  // Instructions
  INSTRUCTIONS: {
    PILOT: "Pilot your vessel using",
    KEY_SPACE: "Spacebar",
    OR: "or",
    TOUCH: "Touch",
    CONTROLS: "Spacebar or Touch",
    GOAL: "Keep your bovine captive safe. Fly high to avoid buildings, but remember:",
    FUEL_RULE: "You must fly low to recharge your GravyFuel.",
    ALTITUDE_WARNING: "Flying higher is safer but drains fuel rapidly!",
    SURVIVAL_TIP: "Stay low to survive."
  }
};
