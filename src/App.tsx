import { HistoryOutlined } from "@ant-design/icons";
import { AutoComplete, Input } from "antd";
import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { addSearches } from "./features/places/placesSlice";

declare global {
  interface Window {
    initMap: () => void;
  }
}

function App() {
  const dispatch = useAppDispatch();
  const pastSearches = useAppSelector((state) => state.places.searches);

  console.log(pastSearches);

  useEffect(() => {
    function initMap(): void {
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: { lat: 40.749933, lng: -73.98633 },
          zoom: 13,
          mapTypeControl: false,
        }
      );
      const card = document.getElementById("pac-card") as HTMLElement;
      const input = document.getElementById("pac-input") as HTMLInputElement;

      const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        types: ["establishment"],
      };

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

      const autocomplete = new google.maps.places.Autocomplete(input, options);

      // Bind the map's bounds (viewport) property to the autocomplete object,
      // so that the autocomplete requests use the current map bounds for the
      // bounds option in the request.
      autocomplete.bindTo("bounds", map);

      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById(
        "infowindow-content"
      ) as HTMLElement;

      infowindow.setContent(infowindowContent);

      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });

      autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        dispatch(addSearches(place));

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
      });
    }

    initMap();
  }, [dispatch, pastSearches]);

  // const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   const displaySuggestions = function (
  //     predictions: google.maps.places.QueryAutocompletePrediction[] | null,
  //     status: google.maps.places.PlacesServiceStatus
  //   ) {
  //     if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
  //       alert(status);
  //       return;
  //     }

  //     console.log("predictions ===>", predictions);

  //     predictions.forEach((prediction) => {
  //       const li = document.createElement("li");

  //       li.appendChild(document.createTextNode(prediction.description));
  //       (document.getElementById("results") as HTMLUListElement).appendChild(
  //         li
  //       );
  //     });
  //   };

  //   const service = new google.maps.places.AutocompleteService();

  //   service.getQueryPredictions({ input: e.target.value }, displaySuggestions);
  // };

  const renderPastSearches = (el: google.maps.places.PlaceResult) => ({
    label: (
      <div>
        <HistoryOutlined />
        <span style={{ marginLeft: "1rem" }}>{el.name}</span>
      </div>
    ),
  });

  const options = pastSearches.map((el) => renderPastSearches(el));

  return (
    <>
      <AutoComplete
        style={{
          position: "absolute",
          margin: "1rem",
          zIndex: 10,
          width: 300,
        }}
        options={options}
        id={"pac-input"}
      >
        <Input.Search placeholder="Find a place..." />
      </AutoComplete>

      <div id="map" />
    </>
  );
}

export default App;
