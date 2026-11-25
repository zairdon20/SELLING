import { CategoryPage } from "@/components/CategoryPage";

export const metadata = {
  title: "Phones | TwendaChina",
  description:
    "Shop the latest smartphones in Zambia — iPhone, Samsung Galaxy, Google Pixel and more. Pay securely in Kwacha.",
};

export default function PhonesPage() {
  return (
    <CategoryPage
      category="phones"
      title="Phones"
      subtitle="Flagship smartphones from Apple, Samsung, Google and more — the latest models with the best cameras and fastest chips, delivered across Zambia."
    />
  );
}
