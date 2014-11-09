
#include "SimpleTimer.h"

#define ANALOG_PIN 5

#define LED_PIN1 6
#define LED_PIN2 5
#define LED_PIN3 4

int val = 0;
int dif = 0;
int target = 100;
int pin = 0;

SimpleTimer timer;
int timerId;
long samples;
long pulseWidth;
long pulses;

void pulse(int pin, long cycles) {
  digitalWrite(pin, HIGH);
  for (long i = 0 ; i < cycles ; i++) {
	i++;
  }
  digitalWrite(pin, LOW);
}

void setup()
{
    pinMode(LED_PIN1, OUTPUT);
    pinMode(LED_PIN2, OUTPUT);
    pinMode(LED_PIN3, OUTPUT);

	digitalWrite(LED_PIN1, LOW);
	digitalWrite(LED_PIN2, HIGH);
	digitalWrite(LED_PIN3, LOW);

    pinMode(ANALOG_PIN, INPUT);

    Serial.begin(115200);
	timerId = timer.setInterval(25, reportVoltage);
}

void reportVoltage() {
	val = analogRead(ANALOG_PIN);
	dif = val - target;
	Serial.println(val);
}

void pulse(long microseconds) {
  long cycles = microseconds * 16;

  long start = millis();

  digitalWrite(LED_PIN2, LOW);
  digitalWrite(LED_PIN1, HIGH);


  for (long i = 0 ; i < cycles ; i++) {
	digitalWrite(LED_PIN1, HIGH);	  
  }
  long powerOn = millis();

  //Finish the pulse and let it flow
  digitalWrite(LED_PIN1, LOW);
  digitalWrite(LED_PIN2, HIGH);

  for (int k = 0 ; k < samples ; k++) {
	digitalWrite(LED_PIN2, HIGH);


  }
  long powerOff = millis();

  for (int k = 0 ; k < samples ; k++) {
	reportVoltage();
  }


  long pulsed = powerOn - start;
  Serial.print("pulsed: ");
  Serial.print(pulsed);
  Serial.print(" sunk: ");
  Serial.println(powerOff - start - pulsed);

}

void on(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, HIGH);
}

void off(int pin) {
  pinMode(pin, OUTPUT);
  digitalWrite(pin, LOW);
}

void serialEvent() {
  while (Serial.available()) {
	char inChar = (char)Serial.read();

	if (inChar == 13) {
	  Serial.println();

	} else if (inChar == 'p') {
	  pulseWidth = Serial.parseInt();
	  Serial.print("(pulsing ");
	  Serial.print(pulseWidth);
	  Serial.println(")");	  
	  pulse(pulseWidth);
	} else if (inChar == 's') {
	  samples = Serial.parseInt();
	  Serial.print("(samples ");
	  Serial.print(samples);
	  Serial.println(")");	  
	} else if (inChar == 'r') {
	  pulses = Serial.parseInt();
	  Serial.print("(pulses ");
	  Serial.print(pulses);
	  for (long p = 0 ; p < pulses ; p++) {
		pulse(pulseWidth);
	  }
	  Serial.println(")");	  
	} else if (inChar == 'o') {
	  pin = Serial.parseInt();
	  
	  Serial.print("(onPin ");
	  Serial.print(pin);
	  Serial.println(")");	  

	  on(pin);
	} else if (inChar == 'f') {
	  pin = Serial.parseInt();
	  
	  Serial.print("(offPin ");
	  Serial.print(pin);
	  Serial.println(")");

	  off(pin);
	}


  }

}

void loop()
{
  //timer.run();
}


