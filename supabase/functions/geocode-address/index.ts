
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { address, city, province } = await req.json()
    
    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
    if (!apiKey) {
      throw new Error('Google Maps API key not configured')
    }

    const fullAddress = `${address}, ${city}, ${province}, Italia`
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
    
    console.log('Geocoding address:', fullAddress)
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status !== 'OK' || !data.results.length) {
      console.error('Geocoding failed:', data)
      throw new Error(`Geocoding failed for: ${fullAddress}`)
    }
    
    const location = data.results[0].geometry.location
    console.log('Geocoding successful:', location)
    
    return new Response(
      JSON.stringify({ 
        lat: location.lat, 
        lng: location.lng,
        formatted_address: data.results[0].formatted_address
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in geocode function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
