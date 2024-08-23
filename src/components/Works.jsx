import info from "../data/info.json";
import Work from "./Work";

export default function Works() {
  return (
    <>
      <div id="works" className="p-2 md:p-6 mt-4">
        <h1 className="text-2xl font-bold mb-2">Recent Works</h1>
        {info.works.map((i, key) => (
          <Work i={i} key={key} />
        ))}
      </div>
    </>
  );
}
