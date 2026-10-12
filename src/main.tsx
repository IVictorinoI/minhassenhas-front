import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ptBR } from '@mui/material/locale'
import { QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router'
import { SessionProvider } from './auth/Session'
import { queryClient } from './lib/query'
import App from './App'
const theme = createTheme(
    {
        palette: { primary: { main: '#214e80' }, background: { default: '#f4f7fb' } },
        shape: { borderRadius: 12 },
        typography: {
            fontFamily: 'system-ui, sans-serif',
            button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
            MuiButton: { defaultProps: { disableElevation: true } },
            MuiTextField: { defaultProps: { fullWidth: true } },
        },
    },
    ptBR
)
createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <HashRouter>
                    <App />
                </HashRouter>
            </SessionProvider>
        </QueryClientProvider>
    </ThemeProvider>
)
