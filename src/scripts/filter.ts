export function filterProjects(cards: { dataset: { category?: string }; hidden: boolean | string }[], category: string) {
  let visible = 0;
  for (const card of cards) {
    card.hidden = category !== 'All' && card.dataset.category !== category;
    if (!card.hidden) visible++;
  }
  return visible;
}
