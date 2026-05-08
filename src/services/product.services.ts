import { API_URL } from "@/src/config/api";

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;  
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("api_token");
}

export interface Product {
    id?: number;   
    name:string;
    no_identificacion?:string;
    descripcion:string;
    precio_unitario:number;
    cuenta_predial?:string;
    clave_producto:string;
    clave_unidad?:string;
    objeto_imp?:string;
    no_pedimento?:string;
    impuesto_local:string;
    iva?:number;
    iva_retenido?:number;
    ieps?:number;
    isr?:number;
}

export interface ProductListResponse {
    data: Product[];
}

/**
 * Obtener todos los productos
 * */
export async function getProducts(): Promise<Product[]> {
    const token = getToken();

    if (!token) {
        throw new Error("No hay sesión activa");
    }

    const res = await fetch(`${API_URL}/api/products`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
        },
    });

    if (!res.ok)
        {
            const data = await res.json().catch(() => null);
                const message = (data as ApiError)?.message ?? "Error al obtener clientes";
                throw new Error(message);
        }

        const response = await res.json().catch(() => null);
        return Array.isArray(response) ? response : response.data;
    } 

    /**
     * Crear un nuevo producto
     */

    export async function createProduct(productData: Product): Promise<Product> {
        const token = getToken();

        if (!token){
            throw new Error("No hay sesión activa");
        }
        const res = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(productData),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            const err = data as ApiError;
            const firstError = err.errors ? Object.values(err.errors).flat()[0] : err.message ?? "Error al crear cliente";
            throw new Error(firstError);
        }
            return res.json();
    }


    /**
     * Actualizar un producto existente
     */

    export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
        const token = getToken();

        if(!token){
            throw new Error("No hay sesión activa");
        }

        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "Application/json",
            },
            body: JSON.stringify(productData),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            const err = data as ApiError;
            const firstError = err.errors ? Object.values(err.errors).flat()[0] : err.message ?? "Error al actualuizar Producto";
            throw new Error(firstError);
        }
        return res.json();
    }

    /**
     * Eliminar un producto
     */

    export async function deleteProduct(id: number): Promise<void> {
        const token = getToken();

        if (!token){
            throw new Error ("No hay sesión activa");
        }

        const res = await fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Accept": "application/json",
            },
        });

        if(!res.ok){
            const data = await res.json().catch(() => null);
            const message = (data as ApiError)?.message ?? "Error al eliminar producto";
            throw new Error(message);
        }
    }