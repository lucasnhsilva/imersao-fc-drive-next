import MapNewRoute from "./MapNewRoute";
import NewRouteForm from "./NewRouteForm";

export async function searchDirections(source: string, destination: string) {
  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(`http://localhost:3000/places?text=${source}`, {
      cache: "force-cache",
      next: {
        revalidate: 24 * 3600,
      },
    }),
    fetch(`http://localhost:3000/places?text=${destination}`, {
      cache: "force-cache",
      next: {
        revalidate: 24 * 3600,
      },
    }),
  ]);

  if (!sourceResponse.ok) {
    throw new Error("Failed to fetch source data");
  }

  if (!destinationResponse.ok) {
    throw new Error("Failed to fetch destination data");
  }

  const [sourceData, destinationData] = await Promise.all([
    sourceResponse.json(),
    destinationResponse.json(),
  ]);

  const sourcePlaceId = sourceData.candidates[0].place_id;
  const destinationPlaceId = destinationData.candidates[0].place_id;

  const directionsResponse = await fetch(
    `http://localhost:3000/directions?originId=${sourcePlaceId}&destinationId=${destinationPlaceId}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 24 * 3600,
      },
    }
  );

  if (!directionsResponse.ok) {
    throw new Error("Failed to fetch directions data");
  }

  const directionsData = await directionsResponse.json();

  return {
    directionsData,
    sourcePlaceId,
    destinationPlaceId,
  };
}

export async function NewRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ source: string; destination: string }>;
}) {
  const { source, destination } = await searchParams;

  const result =
    source && destination ? await searchDirections(source, destination) : null;

  let directionsData = null;
  let sourcePlaceId = null;
  let destinationPlaceId = null;

  if (result) {
    directionsData = result.directionsData;
    sourcePlaceId = result.sourcePlaceId;
    destinationPlaceId = result.destinationPlaceId;
  }

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-4 h-full">
        <h4 className="text-3xl text-contrast mb-2">Nova rota</h4>
        <form action="" className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="source"
              name="source"
              type="search"
              placeholder=""
              defaultValue={source}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="source"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Origem
            </label>
          </div>
          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="destination"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Destino
            </label>
          </div>
          <button
            type="submit"
            className="bg-main text-primary p-2 rounded text-xl font-bold"
          >
            Pesquisar
          </button>
        </form>
        {directionsData && (
          <div className="mt-4 p-4 border rounded text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origem: </strong>
                {directionsData.routes[0].legs[0].start_address}
              </li>
              <li className="mb-2">
                <strong>Destino: </strong>
                {directionsData.routes[0].legs[0].end_address}
              </li>
              <li className="mb-2">
                <strong>Distância: </strong>
                {directionsData.routes[0].legs[0].distance.text}
              </li>
              <li className="mb-2">
                <strong>Duração: </strong>
                {directionsData.routes[0].legs[0].duration.text}
              </li>
            </ul>
            <NewRouteForm>
              {sourcePlaceId && (
                <input
                  type="hidden"
                  name="sourceId"
                  defaultValue={sourcePlaceId}
                />
              )}
              {destinationPlaceId && (
                <input
                  type="hidden"
                  name="destinationId"
                  defaultValue={destinationPlaceId}
                />
              )}
              <button
                type="submit"
                className="bg-main text-primary p-2 rounded text-xl font-bold mt-4"
              >
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>
      <MapNewRoute directionsData={directionsData} />
    </div>
  );
}

export default NewRoutePage;
