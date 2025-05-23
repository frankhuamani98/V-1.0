import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronUp, CalendarCheck, CheckCircle, XCircle } from "lucide-react";
import { Toaster, toast } from "sonner";
import { router } from "@inertiajs/react";
import { User, Bike, Wrench, BadgeCheck, CalendarDays, Clock3, Info, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/Components/ui/dialog";

interface Reserva {
    id: number;
    usuario: string;
    moto: {
        año: number;
        marca: string;
        modelo: string;
    };
    placa: string;
    servicio: string;
    horario_id: number;
    horario: {
        id: number;
        tipo: string;
        hora_inicio: string;
        hora_fin: string;
    } | null;
    fecha: string;
    hora: string;
    detalles: string;
    estado: string;
    created_at: string;
    updated_at: string;
}

interface ReservasConfirmadasProps {
    reservas: Reserva[];
}

const ReservasConfirmadas = ({ reservas: initialReservas }: ReservasConfirmadasProps) => {
    const [reservas, setReservas] = useState<Reserva[]>(initialReservas);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [detalleReserva, setDetalleReserva] = useState<Reserva | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const toggleRow = (id: number) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleEstadoChange = (id: number, estado: string) => {
        router.patch(`/dashboard/reservas/${id}/estado`, {
            estado: estado
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setReservas(reservas.filter(reserva => reserva.id !== id));
                toast.success("Estado de la reserva actualizado correctamente");
                
                
            },
            onError: () => {
                toast.error("Error al actualizar el estado de la reserva");
            }
        });
    };

    const formatFecha = (fecha: string) => {
        const [year, month, day] = fecha.split('-');
        return `${day}/${month}/${year}`;
    };

    const openDetalleModal = (reserva: Reserva) => {
        setDetalleReserva(reserva);
        setModalOpen(true);
    };

    const closeDetalleModal = () => {
        setModalOpen(false);
        setDetalleReserva(null);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6">
            {/* Modal de detalle */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent
                    className="w-full max-w-xl rounded-2xl p-6 sm:p-8 bg-white/95 shadow-2xl border border-green-200 min-h-[250px] max-h-[90vh] overflow-y-auto"
                    style={{ wordBreak: "break-word" }}
                >
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-green-700 flex items-center gap-2 mb-1 truncate">
                            <FileText className="w-5 h-5 text-green-700" />
                            Detalle de la Reserva
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mb-4 truncate flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-400" />
                            Información completa de la reserva seleccionada.
                        </DialogDescription>
                    </DialogHeader>
                    {detalleReserva && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <User className="w-4 h-4 text-green-700" /> Cliente
                                    </span>
                                    <span className="text-gray-900 font-medium break-words">{detalleReserva.usuario}</span>
                                </div>
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <Bike className="w-4 h-4 text-green-700" /> Moto
                                    </span>
                                    <span className="text-gray-900 break-words">{`${detalleReserva.moto.marca} ${detalleReserva.moto.modelo} ${detalleReserva.moto.año}`} - {detalleReserva.placa}</span>
                                </div>
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <Wrench className="w-4 h-4 text-green-700" /> Servicio
                                    </span>
                                    <span className="text-gray-900 break-words">{detalleReserva.servicio}</span>
                                </div>
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <BadgeCheck className="w-4 h-4 text-green-700" /> Estado
                                    </span>
                                    <Badge className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow border border-gray-200 mt-1">
                                        {detalleReserva.estado.charAt(0).toUpperCase() + detalleReserva.estado.slice(1)}
                                    </Badge>
                                </div>
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <CalendarDays className="w-4 h-4 text-green-700" /> Fecha
                                    </span>
                                    <span className="text-gray-900">{formatFecha(detalleReserva.fecha)}</span>
                                </div>
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <Clock3 className="w-4 h-4 text-green-700" /> Hora
                                    </span>
                                    <span className="text-gray-900">{detalleReserva.hora}</span>
                                </div>
                            </div>
                            {detalleReserva.detalles && (
                                <div className="flex flex-col bg-gray-50 rounded-lg p-3 shadow-sm">
                                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                                        <Info className="w-4 h-4 text-green-700" /> Detalles
                                    </span>
                                    <span className="text-gray-900 break-words">{detalleReserva.detalles}</span>
                                </div>
                            )}
                            <div className="flex justify-end pt-4">
                                <DialogClose asChild>
                                    <Button variant="default" className="px-6 py-2 text-sm font-semibold rounded-lg">
                                        Cerrar
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
            <Card className="border-0 sm:border shadow-md rounded-xl overflow-hidden">
                <CardHeader className="px-4 sm:px-6 bg-white border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CalendarCheck className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">Reservas Confirmadas</CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Gestiona las reservas que han sido confirmadas
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-0 pb-2">
                    <div className="overflow-x-auto">
                        {reservas.length === 0 ? (
                            <div className="text-center py-12 px-4">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                    <CalendarCheck className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">No hay reservas confirmadas</p>
                                <p className="text-gray-500 text-sm mt-1">Las reservas confirmadas aparecerán aquí</p>
                            </div>
                        ) : (
                            <Table className="min-w-full">
                                <TableHeader className="hidden sm:table-header-group bg-gray-50">
                                    <TableRow>
                                        <TableHead className="px-4 py-3 text-gray-600">Cliente</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Moto</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Servicio</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Fecha</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Hora</TableHead>
                                        <TableHead className="px-4 py-3 text-gray-600">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reservas.map((reserva) => (
                                        <React.Fragment key={reserva.id}>
                                            <TableRow className="hidden sm:table-row hover:bg-gray-50 transition-colors">
                                                <TableCell className="px-4 py-4 font-medium">{reserva.usuario}</TableCell>
                                                <TableCell className="px-4 py-4">{`${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}`} - {reserva.placa}</TableCell>
                                                <TableCell className="px-4 py-4">{reserva.servicio}</TableCell>
                                                <TableCell className="px-4 py-4">{formatFecha(reserva.fecha)}</TableCell>
                                                <TableCell className="px-4 py-4">{reserva.hora}</TableCell>
                                                <TableCell className="px-4 py-4">
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDetalleModal(reserva)}
                                                            className="text-xs font-medium"
                                                        >
                                                            <FileText className="h-4 w-4 mr-1 text-green-700" />
                                                            Ver detalle
                                                        </Button>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEstadoChange(reserva.id, "completada")}
                                                                className="text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50"
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                                Completada
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEstadoChange(reserva.id, "cancelada")}
                                                                className="text-xs font-medium text-red-600 border-red-200 hover:bg-red-50"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                            <div className="sm:hidden bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">
                                                            {reserva.usuario}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate mt-0.5">
                                                            {reserva.servicio}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                                Confirmada
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                {formatFecha(reserva.fecha)} - {reserva.hora}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-full hover:bg-gray-100"
                                                        onClick={() => toggleRow(reserva.id)}
                                                        aria-label="Ver detalles"
                                                    >
                                                        {expandedRows.includes(reserva.id) ? (
                                                            <ChevronUp className="h-4 w-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {expandedRows.includes(reserva.id) && (
                                                    <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Moto:</span>
                                                            <span className="font-medium text-gray-800">{`${reserva.moto.marca} ${reserva.moto.modelo} ${reserva.moto.año}`} - {reserva.placa}</span>
                                                        </div>
                                                        {reserva.detalles && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Detalles:</span>
                                                                <span className="font-medium text-gray-800">{reserva.detalles}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-2 mt-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openDetalleModal(reserva)}
                                                                className="text-xs font-medium flex-1"
                                                            >
                                                                <FileText className="h-4 w-4 mr-1 text-green-700" />
                                                                Ver detalle
                                                            </Button>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEstadoChange(reserva.id, "completada")}
                                                                className="text-xs font-medium text-blue-600 border-blue-200 hover:bg-blue-50 flex-1"
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                                Completada
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleEstadoChange(reserva.id, "cancelada")}
                                                                className="text-xs font-medium text-red-600 border-red-200 hover:bg-red-50 flex-1"
                                                            >
                                                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                                                Cancelar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Toaster position="top-right" closeButton />
        </div>
    );
};

export default ReservasConfirmadas;