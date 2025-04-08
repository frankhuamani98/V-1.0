import React, { useState } from "react";
import { Eye, Edit, Trash2, Plus, ChevronDown, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/Components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Badge } from "@/Components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/Components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { router } from "@inertiajs/react";

interface ImagenAdicional {
  url: string;
  estilo?: string;
}

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: string;
  descuento: string;
  precio_total: string;
  stock: number;
  estado: string;
  imagen_principal: string;
  imagenes_adicionales: ImagenAdicional[];
  destacado: boolean;
  mas_vendido: boolean;
  created_at: string;
  detalles?: string;
}

interface InventarioProductosProps {
  productos: Producto[];
}

const InventarioProductos: React.FC<InventarioProductosProps> = ({ productos = [] }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filtrar productos basados en búsqueda
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch = 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Manejar ver detalles
  const handleViewDetails = (producto: Producto) => {
    setCurrentProduct(producto);
    setCurrentImageIndex(0);
    setIsDetailOpen(true);
  };

  // Manejar eliminación
  const handleDelete = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsDeleteOpen(true);
  };

  // Confirmar eliminación
  const confirmDelete = () => {
    if (currentProduct) {
      router.delete(route('productos.destroy', currentProduct.id), {
        onSuccess: () => {
          setIsDeleteOpen(false);
        },
        onError: () => {
          alert('Error al eliminar el producto');
        }
      });
    }
  };

  // Obtener badge de estado
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Activo':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Activo</Badge>;
      case 'Inactivo':
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Inactivo</Badge>;
      case 'Agotado':
        return <Badge variant="default" className="bg-red-500 hover:bg-red-600">Agotado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  // Navegación de imágenes en el modal
  const nextImage = () => {
    if (!currentProduct) return;
    
    const totalImages = 1 + (currentProduct.imagenes_adicionales?.length || 0);
    setCurrentImageIndex(prev => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    if (!currentProduct) return;
    
    const totalImages = 1 + (currentProduct.imagenes_adicionales?.length || 0);
    setCurrentImageIndex(prev => (prev - 1 + totalImages) % totalImages);
  };

  // Obtener la imagen actual para mostrar
  const getCurrentImage = () => {
    if (!currentProduct) return '';
    
    if (currentImageIndex === 0) {
      return currentProduct.imagen_principal;
    }
    
    const additionalIndex = currentImageIndex - 1;
    if (currentProduct.imagenes_adicionales && currentProduct.imagenes_adicionales[additionalIndex]) {
      return currentProduct.imagenes_adicionales[additionalIndex].url;
    }
    
    return currentProduct.imagen_principal;
  };

  // Obtener el estilo de la imagen actual
  const getCurrentImageStyle = () => {
    if (!currentProduct || currentImageIndex === 0) return "Imagen principal";
    
    const additionalIndex = currentImageIndex - 1;
    if (currentProduct.imagenes_adicionales && currentProduct.imagenes_adicionales[additionalIndex]) {
      return currentProduct.imagenes_adicionales[additionalIndex].estilo || "Sin descripción";
    }
    
    return "Sin descripción";
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 max-w-screen-2xl mx-auto">
        {/* Encabezado y controles */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventario de Productos</h1>
            <p className="text-sm text-gray-500 mt-1">
              {productos.length} {productos.length === 1 ? 'producto registrado' : 'productos registrados'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Input
                placeholder="Buscar productos..."
                className="pl-8 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <Button onClick={() => window.location.href = route('productos.agregar')}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        </div>

        {/* Vista para móviles */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredProducts.map((producto, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {producto.nombre}
                        {producto.destacado && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            Destacado
                          </Badge>
                        )}
                        {producto.mas_vendido && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Más Vendido
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Código: {producto.codigo}
                      </CardDescription>
                    </div>
                    <span className="font-medium">{producto.precio}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Precio</Label>
                      <div className="text-sm">
                        {producto.precio}
                        {producto.descuento !== '0%' && (
                          <span className="ml-2 text-green-500 text-xs">
                            ({producto.descuento} descuento)
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Stock</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm">{producto.stock} unidades</p>
                        {getEstadoBadge(producto.estado)}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        Acciones <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem onClick={() => handleViewDetails(producto)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = route('productos.agregar', { id: producto.id })}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(producto)}
                        className="text-red-500"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vista para desktop */}
        <div className="hidden md:block border rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock/Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((producto, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {producto.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={producto.imagen_principal || "https://placehold.co/100x100?text=Sin+imagen"} 
                              alt={producto.nombre}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Sin+imagen";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {producto.nombre}
                              {producto.destacado && (
                                <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-xs">
                                  Destacado
                                </Badge>
                              )}
                              {producto.mas_vendido && (
                                <Badge className="ml-2 bg-green-500 hover:bg-green-600 text-xs">
                                  Más Vendido
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium">{producto.precio}</div>
                        {producto.descuento !== '0%' && (
                          <div className="text-xs text-green-500">
                            Descuento: {producto.descuento} ({producto.precio_total})
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <span>{producto.stock} unidades</span>
                          {getEstadoBadge(producto.estado)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(producto)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalles</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.location.href = route('productos.agregar', { id: producto.id })}
                                className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(producto)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Eliminar producto
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Detalles */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalles del Producto</DialogTitle>
              {currentProduct && (
                <DialogDescription>
                  Código: {currentProduct.codigo} | Registrado: {currentProduct.created_at}
                </DialogDescription>
              )}
            </DialogHeader>
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="relative">
                  {/* Sección de imágenes con descripción de estilo */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4" />
                      <span>Estilo/Comentario: {getCurrentImageStyle()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Imagen {currentImageIndex + 1} de {1 + (currentProduct.imagenes_adicionales?.length || 0)}
                    </div>
                  </div>

                  {/* Imagen principal y adicionales */}
                  <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={getCurrentImage() || "https://placehold.co/600x600?text=Imagen+no+disponible"}
                      alt={`Imagen ${currentImageIndex === 0 ? 'principal' : currentImageIndex}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x600?text=Imagen+no+disponible";
                      }}
                    />
                    
                    {/* Navegación de imágenes */}
                    {(currentProduct.imagenes_adicionales?.length || 0) > 0 && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Miniaturas de imágenes con estilos */}
                  <div className="flex gap-2 mt-2 overflow-x-auto py-2">
                    <button
                      onClick={() => setCurrentImageIndex(0)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === 0 ? 'border-blue-500' : 'border-transparent'} relative`}
                    >
                      <img
                        src={currentProduct.imagen_principal}
                        alt="Imagen principal"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Principal";
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-0.5 truncate">
                        Principal
                      </div>
                    </button>

                    {currentProduct.imagenes_adicionales?.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx + 1)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === idx + 1 ? 'border-blue-500' : 'border-transparent'} relative`}
                      >
                        <img
                          src={img.url}
                          alt={`Imagen adicional ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Extra+" + (idx + 1);
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-0.5 truncate">
                          {img.estilo || `Extra ${idx + 1}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{currentProduct.nombre}</h3>
                  <div className="flex gap-2">
                    {currentProduct.destacado && (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        Destacado
                      </Badge>
                    )}
                    {currentProduct.mas_vendido && (
                      <Badge className="bg-green-500 hover:bg-green-600">
                        Más Vendido
                      </Badge>
                    )}
                    {getEstadoBadge(currentProduct.estado)}
                  </div>
                  <div className="text-xl font-bold">{currentProduct.precio}</div>
                  {currentProduct.descuento !== '0%' && (
                    <div className="text-sm">
                      <span className="text-gray-500 line-through">{currentProduct.precio}</span>
                      <span className="ml-2 text-green-600">{currentProduct.precio_total} ({currentProduct.descuento} descuento)</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="font-medium">Stock:</span> {currentProduct.stock} unidades
                  </div>
                </div>

                <div>
                  <Label>Detalles</Label>
                  <Textarea value={currentProduct.detalles || 'No disponible'} readOnly rows={5} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Eliminación */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Estás seguro de eliminar este producto?</DialogTitle>
              <DialogDescription>
                Esta acción no se puede deshacer. El producto será eliminado permanentemente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default InventarioProductos;