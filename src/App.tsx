import React, {useEffect, useState} from 'react';
import {faker} from '@faker-js/faker';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {
  openCardOnFileSwitcher,
  openSubscriptionCanceler,
  addCardSwitcherListener,
  eventNames,
} from 'react-native-knotapi';
import {createNewSession, registerUser} from './api/axios';

export default function App() {
  const [isCardSwitcherLoading, setIsCardSwitcherLoading] = useState(false);
  const [isSubscriptionCancelerLoading, setIsSubscriptionCancelerLoading] =
    useState(false);
  useEffect(() => {
    // @ts-ignore
    const listener = addCardSwitcherListener(eventNames.onEvent, event => {
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

    const sessionRequest = {
      type:
        product === 'subscriptionCanceler'
          ? 'subscription_canceller'
          : 'card_switcher',
    };

    try {
      await registerUser(useData);
      const {session} = await createNewSession(sessionRequest);
      console.log({session});
      if (product === 'cardSwitcher') {
        await openCardOnFileSwitcher({
          sessionId: session,
          clientId: '3f4acb6b-a8c9-47bc-820c-b0eaf24ee771',
          environment: 'sandbox',
          customization,
        });
      }
      if (product === 'subscriptionCanceler') {
        await openSubscriptionCanceler({
          sessionId: session,
          clientId: '3f4acb6b-a8c9-47bc-820c-b0eaf24ee771',
          environment: 'sandbox',
          amount: true,
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
        onPress={() => onPressOpen('cardSwitcher')}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isCardSwitcherLoading ? 'Loading ...' : 'Open Card on file switcher'}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onPressOpen('subscriptionCanceler')}
        style={styles.button}>
        <Text style={styles.textButton}>
          {isSubscriptionCancelerLoading
            ? 'Loading ...'
            : 'Open Subscription canceler'}
        </Text>
      </Pressable>
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
});
