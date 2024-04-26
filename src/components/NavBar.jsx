/* eslint-disable no-unused-vars */
import React from 'react';
import StyledNavLink from './StyledNavlink.jsx';
import { createTheme } from '@mui/material/styles';
import {ThemeProvider, CssBaseline } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

const ToggleColorMode = () => {
    const [mode, setMode] = React.useState('light');

    const toggleColorMode = React.useCallback(() => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }, []);

    const theme = React.useMemo(() => createTheme({
        palette: { mode }
    }), [mode]);

    React.useEffect(() => {
        document.body.style.backgroundColor = theme.palette.background.default;
    }, [theme.palette.background.default]);

    return { toggleColorMode, theme };
};

const NavBar = () => {
    const { toggleColorMode, theme } = ToggleColorMode();

    return (
        <div>
            <ColorModeContext.Provider value={{ toggleColorMode }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <div className="h-32 flex items-center"
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: theme.palette.background.default,
                            color: theme.palette.text.primary,
                            borderRadius: 1,
                            padding: 20,
                            gap: 2
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <StyledNavLink to="/">
                                Home
                            </StyledNavLink>
                        </div>
                        <div className="flex items-center text-xl gap-2">
                            {theme.palette.mode} mode
                            <button  onClick={toggleColorMode}>
                                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                            </button>
                        </div>
                    </div>

                </ThemeProvider>
            </ColorModeContext.Provider>
        </div>
    );
};

export default NavBar;
