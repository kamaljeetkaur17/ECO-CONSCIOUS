const fs = require("fs");
const filePath = "ecommerce.product_updated.json";

const calculateEcoScore = (product) => {
  let score = 0;
  const carbonFootprint = product.carbonFootprint || 0;
  const materialSourcing = product.materialSourcing
    ? product.materialSourcing.toLowerCase()
    : "good";
  const recyclability = product.recyclability || 0;
  const waterUsage = product.waterUsage
    ? product.waterUsage.toLowerCase()
    : "low";
  const energyEfficiency = product.energyEfficiency
    ? product.energyEfficiency.toLowerCase()
    : "low";
  const biodegradability = product.biodegradability || 0;
  const durability = product.durability || "0 months";
  score += carbonFootprint * 0.2;
  const materialSourcingScores = { good: 40, better: 70, best: 100 };
  score += materialSourcingScores[materialSourcing] * 0.2;
  score += recyclability * 0.2;
  const waterUsageScores = { high: 30, moderate: 60, low: 100 };
  score += waterUsageScores[waterUsage] * 0.1;
  const energyEfficiencyScores = { high: 100, moderate: 70, low: 40 };
  score += energyEfficiencyScores[energyEfficiency] * 0.1;
  score += biodegradability * 0.1;
  const durabilityInMonths = durability.includes("month")
    ? parseInt(durability)
    : parseInt(durability) * 12;
  const durabilityScore = Math.min(durabilityInMonths / 12, 1) * 10;
  score += durabilityScore;
  return parseFloat(Math.min(score, 100).toFixed(2));
};

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }
  try {
    const jsonData = JSON.parse(data);
    const updatedData = jsonData.map((product) => {
      const ecoScore = calculateEcoScore(product);
      return { ...product, ecoScore };
    });

    fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
      } else {
        console.log(
          "Successfully calculated and added ecoScore for all products!"
        );
      }
    });
  } catch (parseError) {
    console.error("Error parsing JSON:", parseError);
  }
});
