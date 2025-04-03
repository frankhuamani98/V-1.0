import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { toast } from "sonner"
import { SearchIcon, BikeIcon, SettingsIcon, ArrowRightIcon, ClockIcon, ChevronDownIcon,ChevronRightIcon } from "lucide-react"
import "../../../css/Icons.css"

// Tipos para los datos de motos
interface MotoData {
  years: number[]
  brands: string[]
  models: Array<{
    modelo: string
    marca: string
  }>
}

interface Props {
  motoData: MotoData
}

export default function MotorcycleSearch({ motoData }: Props) {
  const [year, setYear] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [model, setModel] = useState<string>("")
  const [filteredModels, setFilteredModels] = useState<Array<{ modelo: string; marca: string }>>([])
  const [recentSearches, setRecentSearches] = useState<Array<{ year: string; brand: string; model: string }>>([])
  const [loading, setLoading] = useState(false)

  // Recuperar búsquedas recientes del localStorage al cargar el componente
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentMotorcycleSearches")
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches).slice(0, 3))
    }

    // Mostrar toast de bienvenida después de 1.5 segundos
    const timeout = setTimeout(() => {
      toast.success("¡Bienvenido a MotoPartes Pro!", {
        description: "Piezas originales y compatibles con garantía asegurada.",
        duration: 5000,
      })
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  const handleBrandChange = (value: string) => {
    setBrand(value)
    setModel("")
    setFilteredModels(motoData.models.filter((m) => m.marca === value))
  }

  const saveSearch = () => {
    // Solo guardar búsquedas completas
    if (year && brand && model) {
      const modelName = motoData.models.find((m) => m.modelo === model)?.modelo || ""

      const newSearch = { year, brand, model: modelName }
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter((s) => !(s.year === year && s.brand === brand && s.model === modelName)),
      ].slice(0, 3)

      setRecentSearches(updatedSearches)
      localStorage.setItem("recentMotorcycleSearches", JSON.stringify(updatedSearches))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!year || !brand || !model) {
      toast.error("Información incompleta", {
        description: "Por favor selecciona año, marca y modelo para continuar.",
      })
      return
    }

    setLoading(true)
    saveSearch()

    toast.success("Buscando piezas", {
      description: `Localizando componentes para tu ${brand} ${model} ${year}`,
    })

    // Redirección con parámetros
    setTimeout(() => {
      const params = new URLSearchParams()
      params.append("year", year)
      params.append("brand", brand)
      params.append("model", model)
      window.location.href = `/resultados?${params.toString()}`
    }, 800)
  }

  const handleQuickSearch = (search: { year: string; brand: string; model: string }) => {
    setLoading(true)
    toast.success("Búsqueda rápida", {
      description: `Localizando componentes para tu ${search.brand} ${search.model} ${search.year}`,
    })

    setTimeout(() => {
      const params = new URLSearchParams()
      params.append("year", search.year)
      params.append("brand", search.brand)
      params.append("model", search.model)
      window.location.href = `/resultados?${params.toString()}`
    }, 800)
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Fondo con gradiente mejorado */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>

        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Formas decorativas */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl max-h-96 bg-gradient-to-tr from-cyan-400 to-slate-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center space-x-2 mb-5 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="h-[1px] w-12 bg-cyan-300/50"></div>
              <span className="text-cyan-300 text-sm font-medium uppercase tracking-widest">
                Precisión en Repuestos
              </span>
              <div className="h-[1px] w-12 bg-cyan-300/50"></div>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-center mb-8 tracking-tight leading-tight max-w-4xl animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              Servicio{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">premium</span>{" "}
              para tu motocicleta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">favorita</span>
            </h1>

            <p
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-normal text-center mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              Atención personalizada y mantenimiento especializado para cada modelo. Nuestros expertos están listos para
              brindarte la mejor experiencia.
            </p>

            <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <div className="flex gap-4">
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 group"
                  onClick={() => {
                    window.location.href = "/agendar-servicio"
                  }}
                >
                  <span>Agendar servicio</span>
                  <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1" />
                </Button>
                <Button
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 flex items-center gap-2"
                  onClick={() => {
                    window.location.href = "/contacto"
                  }}
                >
                  <span>Contactar ahora</span>
                  <ChevronRightIcon className="h-5 w-5 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Componente de búsqueda */}
      <div className="container mx-auto px-4 py-12" id="motorcycle-finder">
        <Card className="border-none rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 -mt-16 z-10 transform transition-all duration-500 hover:shadow-cyan-500/5">
          <CardContent className="p-0">
            <div className="p-8">
              <div className="text-center mb-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-105">
                  <img
                    src="https://media.tenor.com/0RxAveI4iJEAAAAm/motorcycle-riding.webp"
                    alt="Motorcycle Riding"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Personaliza tu experiencia</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto">
                  Selecciona tu modelo para recibir atención especializada y servicios a medida para tu motocicleta
                </p>
              </div>

              <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3 group">
                    <Label
                      htmlFor="year"
                      className="font-medium text-sm flex items-center text-slate-700 dark:text-slate-200 ml-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                    >
                      <ClockIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                      Año del modelo
                    </Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger
                        id="year"
                        className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                      >
                        <SelectValue placeholder="Selecciona año" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl">
                        {motoData.years.map((y, index) => (
                          <SelectItem
                            key={index}
                            value={y.toString()}
                            className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20"
                          >
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 group">
                    <Label
                      htmlFor="brand"
                      className="font-medium text-sm flex items-center text-slate-700 dark:text-slate-200 ml-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                    >
                      <SettingsIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                      Marca
                    </Label>
                    <Select value={brand} onValueChange={handleBrandChange}>
                      <SelectTrigger
                        id="brand"
                        className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                      >
                        <SelectValue placeholder="Selecciona marca" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl">
                        {motoData.brands.map((b, index) => (
                          <SelectItem key={index} value={b} className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20">
                            {b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 group">
                    <Label
                      htmlFor="model"
                      className="font-medium text-sm flex items-center text-slate-700 dark:text-slate-200 ml-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                    >
                      <BikeIcon className="h-4 w-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" />
                      Modelo específico
                    </Label>
                    <Select value={model} onValueChange={setModel} disabled={!brand}>
                      <SelectTrigger
                        id="model"
                        className="w-full bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl h-12 transition-all hover:border-cyan-400 focus:border-cyan-500 group-hover:shadow-sm"
                      >
                        <SelectValue placeholder={brand ? "Selecciona modelo" : "Primero selecciona una marca"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl">
                        {filteredModels.map((m, index) => (
                          <SelectItem
                            key={index}
                            value={m.modelo}
                            className="focus:bg-cyan-50 dark:focus:bg-cyan-900/20"
                          >
                            {m.modelo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="text-center mt-10">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 min-w-[220px] transform hover:translate-y-[-2px]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando...</span>
                      </div>
                    ) : (
                      <>
                        <SearchIcon className="h-5 w-5 mr-2" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {recentSearches.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center justify-center mb-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent flex-grow"></div>
                    <span className="px-4 text-slate-500 dark:text-slate-400 text-sm font-medium mx-3">
                      Servicios recientes
                    </span>
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent flex-grow"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuickSearch(search)}
                        className="flex justify-between items-center border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:hover:bg-cyan-900/10 dark:hover:border-cyan-700 rounded-xl h-12 transition-all duration-200 group"
                      >
                        <span className="truncate mr-2 flex items-center text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          <ClockIcon className="h-3.5 w-3.5 mr-2 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                          {search.brand} {search.model} {search.year}
                        </span>
                        <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-cyan-500 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

