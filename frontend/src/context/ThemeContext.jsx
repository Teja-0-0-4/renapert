import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#6366F1',
            light: '#818CF8',
            dark: '#4F46E5',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#A5B4FC',
            light: '#C7D2FE',
            dark: '#818CF8',
            contrastText: '#ffffff',
          },
          background: {
            default: darkMode ? '#111827' : '#F9FAFB',
            paper: darkMode ? '#1F2937' : '#FFFFFF',
            gradient: darkMode 
              ? 'linear-gradient(135deg, #1F2937 0%, #111827 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
          },
          text: {
            primary: darkMode ? '#F9FAFB' : '#111827',
            secondary: darkMode ? '#9CA3AF' : '#4B5563',
          },
          divider: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          action: {
            hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            selected: darkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 700,
            fontSize: '1.75rem',
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
          },
          h6: {
            fontWeight: 600,
            fontSize: '1rem',
          },
          subtitle1: {
            fontSize: '1rem',
            fontWeight: 500,
          },
          subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.5,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: [
          'none',
          '0px 2px 4px rgba(0, 0, 0, 0.05)',
          '0px 4px 8px rgba(0, 0, 0, 0.05)',
          '0px 8px 16px rgba(0, 0, 0, 0.05)',
          '0px 16px 24px rgba(0, 0, 0, 0.05)',
          '0px 24px 32px rgba(0, 0, 0, 0.05)',
          ...Array(19).fill('none'),
        ],
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: darkMode ? '#1F2937' : '#F3F4F6',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: darkMode ? '#4B5563' : '#9CA3AF',
                  borderRadius: '4px',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '8px 24px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
              contained: {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: darkMode ? '#6366F1' : '#4F46E5',
                    },
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
                },
                '&.Mui-selected': {
                  backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.08)',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.12)',
                  },
                },
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: '8px 0',
                },
              },
            },
          },
          MuiAccordionSummary: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                '&.Mui-expanded': {
                  minHeight: 48,
                },
              },
            },
          },
          MuiSkeleton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}; 