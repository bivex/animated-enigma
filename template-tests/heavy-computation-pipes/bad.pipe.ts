@Pipe({
  name: 'sortAndFilter',
  pure: false // Impure—runs every change detection cycle
})
export class SortAndFilterPipe implements PipeTransform {
  transform(items: Item[], sortBy: string, filterBy: string): Item[] {
    // This runs EVERY change detection cycle, not just when inputs change
    return items
      .filter(item => item.type === filterBy)
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
  }
}