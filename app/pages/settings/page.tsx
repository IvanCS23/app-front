"use client";
import React from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { User, Lock, Upload, MapPin, FileText, Puzzle, Users, Banknote, Settings, MessageCircle, CreditCard } from "lucide-react";

const configCards = [
	{
		icon: <User className="h-7 w-7 text-blue-500" />, title: "Mi Perfil", desc: "Gestiona tus datos personales, contraseña y preferencias de seguridad de la cuenta.", action: "CONFIGURAR", actionColor: "text-blue-400"
	},
	{
		icon: <Lock className="h-7 w-7 text-blue-500" />, title: "Sellos Digitales / FIEL", desc: "Carga tus certificados .cer y .key vigentes para el timbrado oficial de facturas.", action: "GESTIONAR CERTIFICADOS", actionColor: "text-blue-400"
	},
	{
		icon: <Upload className="h-7 w-7 text-blue-500" />, title: "Sube CIF de tus clientes", desc: "Importación masiva de datos fiscales mediante la Constancia de Situación Fiscal.", action: "IMPORTACIÓN", actionColor: "text-blue-400"
	},
	{
		icon: <MapPin className="h-7 w-7 text-blue-500" />, title: "Lugar de Expedición", desc: "Configura las sucursales, domicilios y códigos postales de emisión.", action: "SUCURSALES", actionColor: "text-blue-400"
	},
	{
		icon: <FileText className="h-7 w-7 text-blue-500" />, title: "Tipos de Comprobantes", desc: "Configura folios y series para facturas, notas de crédito, recibos y pagos.", action: "SERIES Y FOLIOS", actionColor: "text-blue-400"
	},
	{
		icon: <Puzzle className="h-7 w-7 text-blue-500" />, title: "Addendas", desc: "Configuración de campos extra requeridos por clientes comerciales específicos.", action: "CONFIGURAR ADDENDAS", actionColor: "text-blue-400"
	},
	{
		icon: <Users className="h-7 w-7 text-blue-500" />, title: "Usuarios", desc: "Asigna roles y permisos específicos para tu equipo de contabilidad y ventas.", action: "GESTIONAR ROLES", actionColor: "text-blue-400"
	},
	{
		icon: <Banknote className="h-7 w-7 text-blue-500" />, title: "Cuentas de Banco", desc: "Registra CLABES interbancarias para que aparezcan en tus facturas para cobro.", action: "CUENTAS DE PAGO", actionColor: "text-blue-400"
	},
	{
		icon: <Settings className="h-7 w-7 text-blue-500" />, title: "Ajustes Generales", desc: "Notificaciones por correo, idioma del sistema y temas visuales.", action: "PREFERENCIAS", actionColor: "text-blue-400"
	},
	{
		icon: <MessageCircle className="h-7 w-7 text-blue-500" />, title: "Observaciones", desc: "Define textos predeterminados para términos y condiciones en tus PDF.", action: "EDITAR TEXTOS", actionColor: "text-blue-400"
	},
];

export default function SettingsPage() {
	return (
		<AppLayout>
			<div className="min-h-screen bg-[#151c24] text-white p-8">
				<div className="flex justify-between items-center mb-2">
					<div className="flex items-center gap-2">
						<div className="bg-blue-700 rounded-full p-2"><Settings className="h-6 w-6 text-white" /></div>
						<span className="text-xl font-bold text-blue-400 tracking-tight">FACTURAPRO</span>
					</div>
					<button className="bg-[#232b36] px-4 py-2 rounded-lg text-white text-sm font-semibold hover:bg-[#232b36]/80">Soporte</button>
				</div>
				<h1 className="text-4xl font-extrabold mt-2 mb-2">Panel de Configuración</h1>
				<p className="text-gray-400 mb-8">Gestiona la identidad fiscal de tu empresa, integra métodos de pago y personaliza la emisión de comprobantes digitales.</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					{configCards.slice(0, 9).map((card, i) => (
						<div key={i} className="bg-[#1a222c] rounded-2xl p-6 flex flex-col gap-3 min-h-[170px]">
							<div>{card.icon}</div>
							<div className="font-bold text-lg mb-1">{card.title}</div>
							<div className="text-gray-400 text-sm flex-1">{card.desc}</div>
							<button className={`mt-2 text-xs font-bold tracking-wide ${card.actionColor} hover:underline text-left`}>{card.action} &gt;</button>
						</div>
					))}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-[#1a222c] rounded-2xl p-6 flex flex-col justify-between min-h-[170px]">
						<div className="font-bold text-lg mb-1 flex items-center gap-2"><MessageCircle className="h-7 w-7 text-blue-500" /> Observaciones</div>
						<div className="text-gray-400 text-sm flex-1">Define textos predeterminados para términos y condiciones en tus PDF.</div>
						<button className="mt-2 text-xs font-bold tracking-wide text-blue-400 hover:underline text-left">EDITAR TEXTOS &gt;</button>
					</div>
					<div className="bg-[#1a222c] rounded-2xl p-6 flex flex-col justify-between min-h-[170px] relative overflow-hidden">
						<div className="flex items-center gap-2 mb-2"><CreditCard className="h-7 w-7 text-blue-500" /><span className="font-bold text-lg">Integración con PayPal</span></div>
						<div className="text-gray-300 text-sm mb-4">Activa pagos directos desde tus facturas electrónicas. Recibe pagos con tarjeta de crédito o saldo PayPal de forma automática.</div>
						<button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold text-white text-sm w-fit">Conectar Ahora</button>
						<span className="text-xs text-gray-400 mt-2">Requiere cuenta Business</span>
						<div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-[radial-gradient(circle,rgba(37,99,235,0.10)_0%,transparent_70%)] pointer-events-none" />
						<div className="absolute right-0 top-0 w-1/2 h-1/2 border border-dashed border-gray-700 opacity-30" style={{borderRadius:'1rem'}} />
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
