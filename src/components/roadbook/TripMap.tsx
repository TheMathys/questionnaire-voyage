import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { AccommodationItem, PoiItem } from '../../types/trip'

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Props {
  lat: number
  lng: number
  label: string
  pois: PoiItem[]
  accommodations: AccommodationItem[]
}

export function TripMap({ lat, lng, label, pois, accommodations }: Props) {
  if (!lat && !lng) {
    return (
      <div className="trib-card flex h-64 items-center justify-center p-6 text-sm text-trib-muted">
        Carte indisponible pour cette destination.
      </div>
    )
  }

  const markers = [
    ...pois.filter((p) => p.lat && p.lng).slice(0, 5),
    ...accommodations.filter((a) => a.lat && a.lng).slice(0, 3),
  ]

  return (
    <div className="trib-card overflow-hidden">
      <div className="h-72 w-full sm:h-80">
        <MapContainer
          center={[lat, lng]}
          zoom={11}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{ zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>{label}</Popup>
          </Marker>
          {markers.map((m) =>
            m.lat != null && m.lng != null ? (
              <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
                <Popup>{m.name}</Popup>
              </Marker>
            ) : null,
          )}
        </MapContainer>
      </div>
      <p className="px-4 py-2 text-xs text-trib-muted">© OpenStreetMap contributors</p>
    </div>
  )
}
