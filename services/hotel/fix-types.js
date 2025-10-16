const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/services/dynamic-pricing.service.ts',
  'src/services/pricing.service.ts',
  'src/services/promotion.service.ts',
  'src/services/property.service.ts',
  'src/services/seasonal-pricing.service.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix common type casting issues
    content = content.replace(/conditions as PricingCondition\[\]/g, 'conditions as unknown as PricingCondition[]');
    content = content.replace(/adjustments as PricingAdjustment\[\]/g, 'adjustments as unknown as PricingAdjustment[]');
    content = content.replace(/roomTypeRates as SeasonalRoomTypeRate\[\]/g, 'roomTypeRates as unknown as SeasonalRoomTypeRate[]');
    content = content.replace(/usage as PromotionUsage/g, 'usage as unknown as PromotionUsage');
    content = content.replace(/conditions as PromotionCondition\[\]/g, 'conditions as unknown as PromotionCondition[]');

    // Fix null to undefined conversions
    content = content.replace(/(\w+)\.(\w+) \?\? undefined/g, '$1.$2 ?? undefined');
    content = content.replace(/: (\w+) \| null/g, ': $1 | null | undefined');

    // Fix spread operations on JSON fields
    content = content.replace(/\.\.\.(\w+)\.address,/g, '...(($1.address as any) || {}),');
    content = content.replace(/\.\.\.(\w+)\.policies,/g, '...(($1.policies as any) || {}),');
    content = content.replace(/\.\.\.(\w+)\.contactInfo,/g, '...(($1.contactInfo as any) || {}),');
    content = content.replace(/\.\.\.(\w+)\.settings,/g, '...(($1.settings as any) || {}),');

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
});

console.log('Type fixes applied');