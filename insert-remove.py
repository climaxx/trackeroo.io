#!/usr/bin/env python
"""
Sample script that monitors smartcard insertion/removal.

__author__ = "http://www.gemalto.com"

Copyright 2001-2012 gemalto
Author: Jean-Daniel Aussel, mailto:jean-daniel.aussel@gemalto.com

This file is part of pyscard.

pyscard is free software; you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 2.1 of the License, or
(at your option) any later version.

pyscard is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with pyscard; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
"""

from __future__ import print_function
from time import sleep

from smartcard.CardMonitoring import CardMonitor, CardObserver
from smartcard.util import toHexString

import urllib2
import urllib


# a simple card observer that prints inserted/removed cards
class PrintObserver(CardObserver):
    """A simple card observer that is notified
    when cards are inserted/removed from the system and
    prints the list of cards
    """

    def getUrlParams(self, inputData):
        values = {'atr': inputData};
        data = urllib.urlencode(values)
        data = data.encode('utf-8')
        return data

    def update(self, observable, actions):
        (addedcards, removedcards) = actions
        for card in addedcards:
            data = self.getUrlParams(toHexString(card.atr))
            print(data)
            urllib2.urlopen("http://localhost:8080/nfc/" + data).read()
        for card in removedcards:
            data = self.getUrlParams(toHexString(card.atr))
            print("-Removed: ", toHexString(card.atr))
            urllib2.urlopen("http://localhost:8080/nfc/out/" + data).read()

if __name__ == '__main__':
    print("Insert or remove a smartcard in the system.")
    print("This program will exit in 10 seconds")
    print("")
    cardmonitor = CardMonitor()
    cardobserver = PrintObserver()
    cardmonitor.addObserver(cardobserver)

    sleep(10)

    # don't forget to remove observer, or the
    # monitor will poll forever...
    cardmonitor.deleteObserver(cardobserver)
