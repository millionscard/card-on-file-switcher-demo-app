import React, {useEffect, useState} from 'react';
import {faker} from '@faker-js/faker';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  addListener,
  eventNames,
  openCardOnFileSwitcher,
  openSubscriptionCanceler,
} from 'react-native-knotapi';
import {createNewSession, createTransaction, registerUser} from './api/axios';
import Config from 'react-native-config';
import {Popup, FullScreenModal} from 'react-native-knot-promo';

export default function App() {
  const [isCardSwitcherLoading, setIsCardSwitcherLoading] = useState(false);
  const [isSubscriptionCancelerLoading, setIsSubscriptionCancelerLoading] =
    useState(false);

  const [showCardSwitcherModal, setShowCardSwitcherModal] = useState(false);
  const [showSubscriptionCancelerModal, setShowSubscriptionCancelerModal] =
    useState(false);
  useEffect(() => {
    // @ts-ignore
    const listener = addListener(eventNames.onEvent, event => {
      console.log({event});
    });
    return () => {
      // @ts-ignore
      listener?.remove();
    };
  }, []);

  const onPressOpen = async (
    product: 'cardSwitcher' | 'subscriptionCanceler',
  ) => {
    if (product === 'subscriptionCanceler') {
      setIsSubscriptionCancelerLoading(true);
    }
    if (product === 'cardSwitcher') {
      setIsCardSwitcherLoading(true);
    }
    let customization = {
      primaryColor: '#5b138c',
      textColor: '#e0e0e0',
      companyName: 'Millions',
    };
    const useData = {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      phone_number: faker.phone.number('##########'),
      password: faker.internet.password(),
      address1: faker.address.streetAddress(),
      address2: faker.address.secondaryAddress(),
      state: faker.address.stateAbbr(),
      city: faker.address.city(),
      postal_code: faker.address.zipCode(),
    };

    try {
      await registerUser(useData);
      const {session} = await createNewSession(
        product === 'cardSwitcher' ? 'card_switcher' : 'subscription_canceller',
      );
      console.log({session});
      if (product === 'cardSwitcher') {
        await openCardOnFileSwitcher({
          sessionId: session,
          clientId: Config.KNOTAPI_CLIENT_ID || '',
          environment:
            Config.KNOTAPI_ENVIRONMENT === 'production'
              ? 'production'
              : 'sandbox',
          customization,
        });
      }
      if (product === 'subscriptionCanceler') {
        await createTransaction({
          amount: 10,
          description: 'Amazon',
          date: new Date().toISOString(),
        });
        await createTransaction({
          amount: 10,
          description: 'Spotify',
          date: new Date().toISOString(),
        });
        await createTransaction({
          amount: 10,
          description: 'Netflix',
          date: new Date().toISOString(),
        });
        await openSubscriptionCanceler({
          sessionId: session,
          clientId: Config.KNOTAPI_CLIENT_ID || '',
          environment:
            Config.KNOTAPI_ENVIRONMENT === 'production'
              ? 'production'
              : 'sandbox',
          customization,
        });
      }
    } catch (e) {
      console.log({e});
    } finally {
      setIsSubscriptionCancelerLoading(false);
      setIsCardSwitcherLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setShowCardSwitcherModal(true)}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isCardSwitcherLoading ? 'Loading ...' : 'Open Card on file switcher'}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowSubscriptionCancelerModal(true)}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isSubscriptionCancelerLoading
            ? 'Loading ...'
            : 'Open Subscription canceler'}
        </Text>
      </Pressable>
      <Popup
        onGetStarted={() => {
          setShowSubscriptionCancelerModal(false);
          void onPressOpen('subscriptionCanceler');
        }}
        isVisible={showSubscriptionCancelerModal}
        cardImage={require('./assets/card.png')}
        primaryColor={'#5b138c'}
        textColor={'#ffffff'}
      />
      <FullScreenModal
        onClose={() => setShowCardSwitcherModal(false)}
        onDone={() => {
          setShowCardSwitcherModal(false);
          void onPressOpen('cardSwitcher');
        }}
        isVisible={showCardSwitcherModal}
        cardImage={require('./assets/card.png')}
        primaryColor={'#5b138c'}
        textColor={'#ffffff'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#5b138c',
    padding: 16,
    width: '60%',
    alignItems: 'center',
    marginVertical: 8,
  },
  textButton: {
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#d3d2d2',
    borderRadius: 4,
    padding: 10,
  },
});
