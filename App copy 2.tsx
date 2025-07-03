import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.text}>Hi Dilakshan 👋</Text>
        <Text style={styles.subtext}>Your app is running successfully!</Text>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffefcf', // your preferred background
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  subtext: {
    fontSize: 16,
    marginTop: 8,
    color: '#555',
  },
});
