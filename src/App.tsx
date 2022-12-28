import { Input } from "antd";
import { useEffect } from "react";
import "./App.css";

declare global {
  interface Window {
    initPac: () => void;
  }
}

function App() {
  function initPac(): void {
    const input = document.getElementById("pac-input") as HTMLInputElement;

    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: false,
      types: ["establishment"],
    };

    const autocomplete = new google.maps.places.Autocomplete(input, options);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    autocomplete.addListener("place_changed", () => {
      infowindow.close();

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      infowindowContent.children["place-name" as any].textContent = place.name;
      infowindowContent.children["place-address" as any].textContent =
        place.formatted_address as any;
    });
  }

  useEffect(() => {
    initPac();
  }, []);

  return (
    <>
      <div className="App">
        <Input.Search
          id={"pac-input"}
          placeholder="Find a place..."
          style={{ width: 500 }}
        />
      </div>
    </>
  );
}

export default App;
