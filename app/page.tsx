import BurgerShowcase from "@/components/BurgerShowcase";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-ember">
          Desde los 2000 · Tu esquina de siempre
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-ink sm:text-7xl">
          La receta
          <br />
          no cambió
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-ink/70 sm:text-lg">
          Golden Burger vuelve tal como la recordabas: la misma sazón, el
          mismo mostrador, la misma esquina de siempre.
        </p>
      </section>

      <BurgerShowcase />
    </>
  );
}