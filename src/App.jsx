import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, DollarSign, Calendar, User, Tag, FileText, CreditCard } from 'lucide-react';

// Options defined from uploaded images, sorted alphabetically
const OPTIONS = {
  egresos: [
    "Deuda Juanis",
    "Diners",
    "Efectivo",
    "Mastercard",
    "Visa"
  ],
  categorias: [
    "Ahorro",
    "Comida Afuera",
    "Formacion",
    "Inversión",
    "Mascotas",
    "Ocio",
    "Personales",
    "Préstamo dinero",
    "Regalos",
    "Salud",
    "Servicio Básico",
    "Supermercado",
    "Trabajo",
    "Transporte",
    "Vacaciones",
    "Vivienda"
  ],
  responsables: [
    "Alejo",
    "Joha"
  ]
};

// YOUR GOOGLE SCRIPT URL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzp78Q8A4uSd18HLZ64z_gjU1wr7YzXKUD3NNMglmkq76sqcVuAtfEG06jXVE8h0Q2SsQ/exec";

export default function App() {
  // State for form fields
  const [formData, setFormData] = useState({
    egreso: OPTIONS.egresos[0], // Default to first option
    fecha: new Date().toISOString().split('T')[0],
    categoria: OPTIONS.categorias[0], // Default to first option
    detalle: '',
    responsable: OPTIONS.responsables[0], // Default to first option
    monto: '',
    diferido: '',
    diferidoTotal: '',
    recurrente: false
  });

  // Configuration state
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus('submitting');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStatus('success');
        setResponseMsg(data.message);
        // Reset sensitive fields but keep dropdown selections for easier repeated entry
        setFormData(prev => ({
          ...prev,
          monto: '',
          detalle: '',
          diferido: '',
          diferidoTotal: ''
        }));
      } else {
        setStatus('error');
        setResponseMsg(data.message || 'Unknown error from script');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setStatus('error');
      setResponseMsg("Error submitting. Check console. (Note: If data appeared in Sheets, this is just a CORS warning).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">

        {/* Header */}
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
          <p className="text-blue-100 text-sm mt-1">Add new entry to Google Sheets</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Row 1: Type (Egreso) & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <CreditCard className="w-4 h-4 mr-1 text-blue-500" /> Payment
              </label>
              <select
                name="egreso"
                value={formData.egreso}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
              >
                {OPTIONS.egresos.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <Calendar className="w-4 h-4 mr-1 text-blue-500" /> Date
              </label>
              <input
                type="date"
                name="fecha"
                required
                value={formData.fecha}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" /> Amount (Monto)
            </label>
            <input
              type="number"
              step="0.01"
              name="monto"
              required
              placeholder="0.00"
              value={formData.monto}
              onChange={handleChange}
              className="w-full text-lg p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 transition-all font-mono"
            />
          </div>

          {/* Category & Responsible */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <Tag className="w-4 h-4 mr-1 text-blue-500" /> Category
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
              >
                {OPTIONS.categorias.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <User className="w-4 h-4 mr-1 text-blue-500" /> Responsible
              </label>
              <select
                name="responsable"
                value={formData.responsable}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all bg-white"
              >
                {OPTIONS.responsables.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detail */}
          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-1">
              <FileText className="w-4 h-4 mr-1 text-blue-500" /> Detail
            </label>
            <textarea
              name="detalle"
              required
              rows="2"
              placeholder="Description of expense..."
              value={formData.detalle}
              onChange={handleChange}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Deferred Section (Optional) */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Optional / Credit Card</div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="diferido"
                placeholder="Cuota (1)"
                value={formData.diferido}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-slate-300 rounded bg-white focus:border-blue-500 outline-none"
              />
              <input
                type="number"
                name="diferidoTotal"
                placeholder="Total (12)"
                value={formData.diferidoTotal}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-slate-300 rounded bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id="recurrente"
                name="recurrente"
                checked={formData.recurrente}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="recurrente" className="ml-2 text-sm text-slate-700">Recurring Expense?</label>
            </div>
          </div>

          {/* Status Messages */}
          {status === 'error' && (
            <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{responseMsg}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-start p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{responseMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all ${
              status === 'submitting'
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {status === 'submitting' ? (
              <span className="flex items-center">Processing...</span>
            ) : (
              <span className="flex items-center">
                <Send className="w-5 h-5 mr-2" /> Submit Expense
              </span>
            )}
          </button>
        </form>
      </div>
      <div className="text-center mt-6 text-slate-400 text-xs">
        Secure Form • Sends directly to Google Sheets
      </div>
    </div>
  );
}
