import React, { useState } from "react";
import { ThemeProvider, createTheme, Button, Box } from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Ensure styles are loaded

// MUI theme setup for light and dark modes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5", paper: "#fff" },
    text: { primary: "#000" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1d1d1d" },
    text: { primary: "#fff" }, // Make all text white in dark mode for readability
  },
});

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const events = [{ title: "Sample Event", start: new Date(), end: new Date() }];
  
  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh", // Full height of the screen
          backgroundColor: "background.default",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            width: "100%", // Ensure the Box takes up full width
            maxWidth: "1200px", // Control max width for readability
            height: "90vh", // Allow it to take 90% of the viewport height
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden",
            padding: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setIsDarkMode(!isDarkMode)}
            sx={{
              marginBottom: 2,
              color: isDarkMode ? "#000" : "#fff", // Adjust button text color
              backgroundColor: isDarkMode ? "#fff" : "#1976d2", // Button background color
              "&:hover": {
                backgroundColor: isDarkMode ? "#ddd" : "#1565c0", // Button hover effect
              },
            }}
          >
            Toggle Dark/Light Mode
          </Button>

          {/* Ensure BigCalendar takes up remaining space */}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <BigCalendar
              localizer={momentLocalizer(moment)}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{
                flexGrow: 1, // Make calendar take up remaining space
                width: "100%", // Ensure full width
                height: "100%", // Ensure full height within the Box container
                backgroundColor: isDarkMode ? "#333" : "#fff",
                color: isDarkMode ? "#fff" : "#000", // Ensure calendar text is readable
                overflow: "auto", // Allow scroll when overflowing
              }}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
