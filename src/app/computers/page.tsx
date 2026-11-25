import { CategoryPage } from "@/components/CategoryPage";

export const metadata = {
  title: "Computers | TwendaChina",
  description:
    "Shop MacBooks, ultrabooks and gaming laptops in Zambia — M-series, Intel and AMD. Pay securely in Kwacha.",
};

export default function ComputersPage() {
  return (
    <CategoryPage
      category="computers"
      title="Computers"
      subtitle="MacBooks, ultrabooks and gaming laptops powered by M-series, Intel and AMD — built for productivity, creativity and play."
    />
  );
}
