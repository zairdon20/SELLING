import { CategoryPage } from "@/components/CategoryPage";

export const metadata = {
  title: "Tablets | TwendaChina",
  description:
    "Shop iPads and Android tablets in Zambia — for work, study and play. Pay securely in Kwacha.",
};

export default function TabletsPage() {
  return (
    <CategoryPage
      category="tablets"
      title="Tablets"
      subtitle="iPads and Android tablets for work, study and play — stunning displays, all-day battery, and Apple Pencil or S Pen support."
    />
  );
}
