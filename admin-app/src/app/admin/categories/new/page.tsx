'use client';

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[color:var(--md-sys-color-on-surface)] mb-4">Add Category</h1>
      <form className="space-y-4 md-surface-container-highest rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--md-sys-color-on-surface)]">Slug</label>
          <input type="text" className="mt-1 block w-full rounded-md border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]" />
        </div>
        <button type="button" className="mt-4 inline-flex items-center rounded-lg px-4 py-2 bg-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-on-primary)] hover:opacity-90">Save</button>
      </form>
    </div>
  );
}
