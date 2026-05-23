export function getDifficultyMultiplier(points) {
    const score = Number(points) || 0

    // Start slow, then ramp up gradually over a long run.
    // Caps at 2x once the player has built up a substantial score.
    return 0.6 + Math.min(score / 20000, 1.4)
}
