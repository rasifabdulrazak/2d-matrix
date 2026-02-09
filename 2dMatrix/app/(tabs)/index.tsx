import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Sample movie data
const movie = {
  title: 'Dune: Part Two',
  rating: '8.9',
  duration: '2h 46m',
  genre: 'Sci-Fi, Adventure',
  poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
};

// Showtimes
const showtimes = ['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '10:00 PM'];

// Dates
const dates = [
  { day: 'MON', date: '12' },
  { day: 'TUE', date: '13' },
  { day: 'WED', date: '14' },
  { day: 'THU', date: '15' },
  { day: 'FRI', date: '16' },
];

// Seat layout (0 = available, 1 = booked, 2 = selected)
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 8;
  const seatLayout: any = {};

  rows.forEach((row) => {
    seatLayout[row] = Array(seatsPerRow)
      .fill(0)
      .map(() => (Math.random() > 0.7 ? 1 : 0));
  });

  return seatLayout;
};

export default function MovieBookingScreen() {
  const [selectedDate, setSelectedDate] = useState(1);
  const [selectedTime, setSelectedTime] = useState(2);
  const [seats, setSeats] = useState(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (row: string, index: number) => {
    const seatId = `${row}${index + 1}`;

    if (seats[row][index] === 1) return; // Already booked

    const newSeats = { ...seats };
    newSeats[row] = [...newSeats[row]];

    if (seats[row][index] === 2) {
      // Deselect
      newSeats[row][index] = 0;
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      // Select
      newSeats[row][index] = 2;
      setSelectedSeats([...selectedSeats, seatId]);
    }

    setSeats(newSeats);
  };

  const totalPrice = selectedSeats.length * 250;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.header}
      >
        <View style={styles.movieInfo}>
          <Image source={{ uri: movie.poster }} style={styles.poster} />
          <View style={styles.movieDetails}>
            <Text style={styles.movieTitle}>{movie.title}</Text>
            <View style={styles.movieMeta}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>⭐ {movie.rating}</Text>
              </View>
              <Text style={styles.metaText}>{movie.duration}</Text>
            </View>
            <Text style={styles.genreText}>{movie.genre}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {dates.map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate === index && styles.dateCardSelected,
                  ]}
                  onPress={() => setSelectedDate(index)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === index && styles.dateTextSelected,
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate === index && styles.dateTextSelected,
                    ]}
                  >
                    {date.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeContainer}>
            {showtimes.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeCard,
                  selectedTime === index && styles.timeCardSelected,
                ]}
                onPress={() => setSelectedTime(index)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === index && styles.timeTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seat Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Seats</Text>

          {/* Screen */}
          <View style={styles.screenContainer}>
            <View style={styles.screen} />
            <Text style={styles.screenText}>SCREEN</Text>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.availableSeat]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.selectedSeat]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.bookedSeat]} />
              <Text style={styles.legendText}>Booked</Text>
            </View>
          </View>

          {/* Seats Grid */}
          <View style={styles.seatsGrid}>
            {Object.keys(seats).map((row) => (
              <View key={row} style={styles.seatRow}>
                <Text style={styles.rowLabel}>{row}</Text>
                {seats[row].map((status: number, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.seat,
                      status === 0 && styles.availableSeat,
                      status === 1 && styles.bookedSeat,
                      status === 2 && styles.selectedSeat,
                    ]}
                    onPress={() => toggleSeat(row, index)}
                    disabled={status === 1}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      {selectedSeats.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.selectedSeatsText}>
              {selectedSeats.join(', ')}
            </Text>
            <Text style={styles.priceText}>₹{totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Seats</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  movieInfo: {
    flexDirection: 'row',
    gap: 15,
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 12,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    color: '#ffc107',
    fontSize: 13,
    fontWeight: '600',
  },
  metaText: {
    color: '#aaa',
    fontSize: 13,
  },
  genreText: {
    color: '#888',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCard: {
    width: 70,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  dateCardSelected: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  dateDay: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateTextSelected: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  timeCardSelected: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  timeTextSelected: {
    color: '#fff',
  },
  screenContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  screen: {
    width: width - 100,
    height: 4,
    backgroundColor: '#e50914',
    borderRadius: 50,
    marginBottom: 8,
  },
  screenText: {
    color: '#666',
    fontSize: 12,
    letterSpacing: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    color: '#888',
    fontSize: 12,
  },
  seatsGrid: {
    gap: 8,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    width: 20,
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  availableSeat: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
  },
  selectedSeat: {
    backgroundColor: '#e50914',
  },
  bookedSeat: {
    backgroundColor: '#555',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  selectedSeatsText: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  priceText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});