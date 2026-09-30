import { useLoaderData } from "react-router";
import { dashboardController } from "~/frontEnd/controllers/dashboardController";
import { useNavigate } from "react-router";
import { authController } from "~/frontEnd/controllers/authController";

export async function clientLoader() {
    return dashboardController.getDashboardPage();
}

export function HydrateFallback() {
    return <p>Loading...</p>;
}

export default function Dashboard() {
    const page = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authController.logout();
        navigate("/login");
    }
    
    return (
        <div>
            <pre>{JSON.stringify(page, null, 2)}</pre>
            <ul>
                {page.dashboardModel.map((p) => (
                    <li key={p.id}>{p.username}</li>
                ))}
            </ul>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}