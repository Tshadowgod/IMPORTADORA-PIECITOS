import { redirect } from "next/navigation";
import { adminConfigurado, haySesionAdmin } from "@/lib/admin-auth";
import FormularioAcceso from "./FormularioAcceso";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await haySesionAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="font-display text-2xl font-bold text-jungle-800">Entrar al panel</h1>
      <p className="mt-1 text-sm font-semibold text-jungle-900/70">
        Escribe la contraseña de administración para ver los pedidos.
      </p>

      {adminConfigurado() ? (
        <FormularioAcceso />
      ) : (
        <div className="mt-5 rounded-2xl border-2 border-lava-500/40 bg-white p-5">
          <p className="font-display font-bold text-lava-600">Panel sin configurar</p>
          <p className="mt-2 text-sm font-semibold text-jungle-900/80">
            Falta la variable <code className="font-mono">ADMIN_PASSWORD</code> en el
            servidor. Agrégala en <code className="font-mono">.env.local</code> (y en
            Vercel, para la web publicada) y vuelve a cargar esta página.
          </p>
        </div>
      )}
    </div>
  );
}
