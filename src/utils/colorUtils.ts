export function getCategoryGradient(categoryColors: string[]): string {
  if (!categoryColors || categoryColors.length === 0) {
    return 'var(--brand-primary)';
  }
  if (categoryColors.length === 1) {
    return categoryColors[0];
  }
  if (categoryColors.length === 2) {
    return `linear-gradient(135deg, ${categoryColors[0]} 0%, ${categoryColors[0]} 50%, ${categoryColors[1]} 50%, ${categoryColors[1]} 100%)`;
  }
  
  const step = 100 / categoryColors.length;
  let gradientStr = 'linear-gradient(135deg, ';
  categoryColors.forEach((color, index) => {
    gradientStr += `${color} ${index * step}%, ${color} ${(index + 1) * step}%`;
    if (index < categoryColors.length - 1) gradientStr += ', ';
  });
  gradientStr += ')';
  return gradientStr;
}
