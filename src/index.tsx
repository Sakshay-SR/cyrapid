import { createRoot } from 'react-dom/client';
import 'tailwindcss/tailwind.css';
import 'utils/styles.css';
import App from 'components/App';
import 'react-toastify/dist/ReactToastify.css';
const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

root.render(<App />);
