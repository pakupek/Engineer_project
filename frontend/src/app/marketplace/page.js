import MarketPlaceClient from "./client";

export default async function MarketplacePage() {
  const res = await fetch("http://dev-django:8000/api/vehicles/for-sale/", {
    cache: "no-store"
  });
  const cars = await res.json();

  return <MarketPlaceClient initialCars={cars} />;
}
