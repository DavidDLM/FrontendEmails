import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Fetch a new email
  const fetchEmail = async () => {
    try {
      const response = await fetch('http://192.168.1.32:5000/random-classify');
      const data = await response.json();

      const email = {
        id: Date.now().toString(),
        text: data.text,
        preview: data.text.substring(0, 50) + '...',
        category: data.category,
      };

      setEmails((prevEmails) => [...prevEmails, email]);
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  const deleteEmail = (id) => {
    setEmails((prevEmails) => prevEmails.filter((email) => email.id !== id));
  };

  const openEmail = (email) => {
    setSelectedEmail(email);
  };

  const closeEmail = () => {
    setSelectedEmail(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Email Classifier</Text>
        <TouchableOpacity onPress={fetchEmail} style={styles.button}>
          <Text style={styles.buttonText}>New Email</Text>
        </TouchableOpacity>
        <FlatList
          data={emails}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openEmail(item)}>
              <View style={[styles.emailCard, { backgroundColor: getColor(item.category) }]}>
                <View style={styles.emailContent}>
                  <Text style={styles.emailPreview}>{item.preview}</Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteEmail(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Modal for full email content */}
        {selectedEmail && (
          <Modal
            visible={true}
            animationType="slide"
            transparent={false}
            onRequestClose={closeEmail}
          >
            <SafeAreaView style={styles.modalContainer}>
              <TouchableOpacity onPress={closeEmail} style={styles.closeButton}>
                <Ionicons name="close-circle-outline" size={36} color="red" />
              </TouchableOpacity>
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalCategory}>{selectedEmail.category}</Text>
                <Text style={styles.modalText}>{selectedEmail.text}</Text>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const getColor = (category) => {
  switch (category) {
    case 'Politics':
      return '#ffcccb'; // Light red
    case 'Entertainment':
      return '#f0e68c'; // Light yellow
    case 'Science':
      return '#add8e6'; // Light blue
    case 'Crime':
      return '#d3d3d3'; // Light gray
    default:
      return '#ffffff'; // White for unclassified
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emailCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  emailContent: {
    flex: 1,
  },
  emailPreview: {
    fontSize: 16,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalContent: {
    marginTop: 20,
  },
  modalCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
