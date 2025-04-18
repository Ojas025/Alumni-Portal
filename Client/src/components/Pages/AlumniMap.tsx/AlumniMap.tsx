import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from "axios";
import { useNotification } from "@/hooks/useNotification";

interface Alumni {
  firstName: string;
  lastName: string;
  profileImageURL: string;
  _id: string;
  location: string; 
  coordinates?: number[];
}

export const AlumniMap = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const { notify } = useNotification();
  
  useEffect(() => {

    const fetchAlumniLocations = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/user/alumni/location', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      console.log(result);  
      setAlumnis(result.data.data);

      } catch (error) {
        console.error('Error fetching alumni locations', error);
        notify({ id: 'map-toast', type: 'error', content: 'Error fetching locations' })
      }
    };

    fetchAlumniLocations();
  }, []);

   
  useEffect(() => {
    if (mapRef.current) return;
    
    const container = document.getElementById('map') as HTMLElement & { _leaflet_id?: number };
    if (!container  || container._leaflet_id) return;
    
    container.style.height = '100vh';
    
    const map = L.map('map', {
      center: [20.5937, 78.9629],
      zoom: 2,
      zoomControl: true,
      attributionControl: false,
    });

    // Add tile layer
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   maxZoom: 19
    // }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">Carto</a>'
    }).addTo(map);

    // L.tileLayer('https://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="http://stamen.com">Stamen Design</a>'
    // }).addTo(map);

    // L.tileLayer('https://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="http://stamen.com">Stamen Design</a>'
    // }).addTo(map);

    // L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    //   attribution: '&copy; <a href="https://www.esri.com">Esri</a>'
    // }).addTo(map);
    
    alumnis.forEach((alumni) => {
      if (!alumni.coordinates?.length) return;

      L.marker(alumni.coordinates as [number, number]).addTo(map).bindPopup(`Name: ${alumni.firstName + ' ' + alumni.lastName}`)
    });

    setTimeout(() => {
      map.invalidateSize(true);
    }, 100);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }; 
  }, [alumnis]);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current?.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      id="map" 
      className="w-full h-full" 
      style={{ 
        height: '70vh',
        width: '100%',
        position: 'fixed'
      }}
    />
  );
};