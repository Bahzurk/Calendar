import React, { useState } from "react";
import { ThemeProvider, createTheme, Button, Box, Typography, TextField } from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
    text: { primary: "#fff" },
  },
});

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([{ title: "Sample Event", start: new Date(), end: new Date(), id: 1 }]);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date() });

  const addEvent = () => {
    if (newEvent.title) {
      const newId = events.length > 0 ? Math.max(...events.map((event) => event.id)) + 1 : 1;
      setEvents([...events, { ...newEvent, id: newId }]);
      setNewEvent({ title: "", start: new Date(), end: new Date() });
    }
  };

  const removeEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "background.default" }}>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", width: "100%", minWidth: "900px", minHeight: "600px", backgroundColor: "background.paper", borderRadius: 2, boxShadow: 3, overflow: "hidden", padding: 2 }}>
          <Button variant="contained" onClick={() => setIsDarkMode(!isDarkMode)} sx={{ marginBottom: 2 }}>
            Toggle Dark/Light Mode
          </Button>
          <Typography variant="h6" sx={{ textAlign: "center", marginBottom: 2 }}>
            {view === "month" ? `Current Month: ${moment(currentDate).format("MMMM YYYY")}` : view === "agenda" ? "Agenda View" : moment(currentDate).format("dddd, MMMM Do YYYY")}
          </Typography>
          
          {view === "agenda" && (
            <Box sx={{ marginBottom: 2, padding: 1, maxWidth: "400px", textAlign: "center" }}>
              <TextField label="Event Title" variant="outlined" fullWidth value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} sx={{ marginBottom: 1 }} />
              <TextField label="Start Time" variant="outlined" type="datetime-local" fullWidth value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")} onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })} sx={{ marginBottom: 1 }} />
              <TextField label="End Time" variant="outlined" type="datetime-local" fullWidth value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")} onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })} sx={{ marginBottom: 1 }} />
              <Button variant="contained" color="primary" onClick={addEvent} sx={{ width: "100%" }}>Add Event</Button>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <BigCalendar
              localizer={momentLocalizer(moment)}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ flexGrow: 1, width: "100%", height: "100%", backgroundColor: isDarkMode ? "#333" : "#fff", color: isDarkMode ? "#fff" : "#000", overflow: "auto" }}
              views={["month", "agenda", "day"]}
              view={view}
              onView={(newView) => setView(newView)}
              onNavigate={(date) => setCurrentDate(date)}
              components={{
                day: ({ date }) => {
                  const currentDateFormatted = new Date().toDateString();
                  const dateFormatted = date.toDateString();
                  return (
                    <>
                      {/* Day Signifier */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          border: dateFormatted === currentDateFormatted ? `2px solid ${isDarkMode ? "#90caf9" : "#1976d2"}` : "none",
                          opacity: dateFormatted === currentDateFormatted ? 0.3 : 0,
                          borderRadius: "4px",
                          zIndex: 0,  // Always on the bottom
                        }}
                      />
                      {/* Event Signifiers */}
                      {events
                        .filter((event) => moment(event.start).isSame(date, "day"))
                        .map((event) => (
                          <Box
                            key={event.id}
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "100%",
                              zIndex: 1,  // Event signifier is above the day signifier
                              backgroundColor: isDarkMode ? "#444" : "#e3f2fd",
                              borderRadius: "4px",
                              margin: "4px",
                              padding: "8px",
                            }}
                          >
                            <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: isDarkMode ? "#fff" : "#000" }}>
                              {event.title}
                            </Typography>
                          </Box>
                        ))}
                    </>
                  );
                },
                event: ({ event }) => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      marginBottom: "8px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        backgroundColor: isDarkMode ? "#444" : "#e3f2fd",
                        borderRadius: "4px",
                        zIndex: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <Typography sx={{ flex: 1 }}>{event.title}</Typography>
                        {(view === "agenda" || view === "day") && (
                          <Typography variant="body2" sx={{ color: "gray", marginRight: 2 }}>
                            {moment(event.start).format("MMM D, YYYY h:mm A")}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        onClick={() => removeEvent(event.id)}
                        sx={{
                          minWidth: "20px",
                          padding: "2px",
                          backgroundColor: "transparent",
                          color: isDarkMode ? "#fff" : "#000",
                          fontSize: "1rem",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: isDarkMode ? "#ff4c4c" : "#ff5722",
                          },
                        }}
                      >
                        X
                      </Button>
                    </Box>
                  </Box>
                ),
              }}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
