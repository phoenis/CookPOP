const DATA = {"recipes":[{"nome":"Pasta al pesto","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"base","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta tonno e limone","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Spaghetti con pomodorini","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta a cacio e pepe","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Ragù","categoria":"Base/Primo","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta fredda","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto alla zucca","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto agli asparagi","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Primavera","categoriaNew":"riso","tempoBucket":"normale","stagioni":["primavera"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Minestra","categoria":"Primo","pref":"❤️","tempo":"30–60 min","prep":"Dipende","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Vellutata di zucca","categoria":"Primo/verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Bistecca","categoria":"Carne","pref":"❤️","tempo":"≤20 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"express","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo alla senape","categoria":"Carne","pref":"❤️","tempo":"30 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Frittata con avanzi","categoria":"Uova","pref":"❤️","tempo":"≤30 min","prep":"Dipende","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"uova","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo alla piastra","categoria":"Carne","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Pollo alla valdostana","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Trancio di salmone al forno","categoria":"Pesce","pref":"❤️","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette al sugo","categoria":"Carne","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette al forno","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Saltimbocca alla romana","categoria":"Carne","pref":"❤️","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Scaloppine al limone","categoria":"Carne","pref":"😐","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Scaloppine ai funghi","categoria":"Carne","pref":"😐","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["autunno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Straccetti di manzo rucola e grana","categoria":"Carne","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Involtini di carne","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo alla cacciatora","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo al forno con patate e rosmarino","categoria":"Carne","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Cotoletta alla milanese","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salsiccia al forno con patate e peperoni","categoria":"Carne","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate/Autunno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["estate","autunno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Forno"]},{"nome":"Arista o arrosto di maiale al latte","categoria":"Carne","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Spezzatino di manzo con patate","categoria":"Carne","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Brasato al vino rosso","categoria":"Carne/progetto","pref":"❤️","tempo":">2 ore","prep":"Weekend","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"progetto","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"marinatura","attrezzatura":[]},{"nome":"Uova al tegamino con pomodoro","categoria":"Uova","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"uova","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Uova in purgatorio","categoria":"Uova","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"uova","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Frittata di zucchine e parmigiano","categoria":"Uova","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"uova","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Frittata di patate","categoria":"Uova","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"uova","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Parmigiana di melanzane","categoria":"Verdure/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Frittata al forno con verdure e formaggio","categoria":"Uova","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"uova","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta e ceci","categoria":"Legumi","pref":"❤️","tempo":"45–60 min","prep":"Ceci in ammollo","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"ammollo","attrezzatura":["Pentola","Frullatore"]},{"nome":"Pasta e fagioli","categoria":"Legumi","pref":"❤️","tempo":"45–60 min","prep":"Fagioli in ammollo","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"ammollo","attrezzatura":[]},{"nome":"Pasta e lenticchie","categoria":"Legumi","pref":"❤️","tempo":"30–45 min","prep":"No/variabile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Ceci in umido al pomodoro e rosmarino + pane","categoria":"Legumi","pref":"❤️","tempo":"45 min","prep":"Ceci in ammollo","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"ammollo","attrezzatura":[]},{"nome":"Lenticchie in umido + uovo/pane","categoria":"Legumi","pref":"❤️","tempo":"30–45 min","prep":"No/variabile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Fagioli all'uccelletto + pane/salsiccia","categoria":"Legumi","pref":"❤️","tempo":"45 min","prep":"Fagioli in ammollo","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"ammollo","attrezzatura":[]},{"nome":"Zuppa di legumi e cereali","categoria":"Legumi","pref":"❤️","tempo":"45–60 min","prep":"Variabile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Farinata di ceci con verdure/formaggi","categoria":"Legumi","pref":"❤️","tempo":"45 min","prep":"Riposo pastella","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Salmone al cartoccio con limone ed erbe","categoria":"Pesce","pref":"❤️","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salmone con zucchine","categoria":"Pesce","pref":"❤️","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pesce","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Orata/branzino al forno con patate","categoria":"Pesce","pref":"😐","tempo":"45 min","prep":"No","freezer":"No","avanzi":"Meglio fresco","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette di tonno e patate","categoria":"Pesce","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Filetti di merluzzo gratinati","categoria":"Pesce","pref":"❤️","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pesce al forno alla mediterranea","categoria":"Pesce","pref":"😐","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pesce","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Zucchine ripiene","categoria":"Verdure","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Zucchine gratinate al forno","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Peperonata","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Peperoni ripieni","categoria":"Verdure","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Asparagi al forno con uovo e parmigiano","categoria":"Verdure","pref":"❤️","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Primavera","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["primavera"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Melanzane ripiene","categoria":"Verdure","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Verdure miste al forno con patate","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Cavolfiore gratinato","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Forno","Pentola"]},{"nome":"Amatriciana","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola"]},{"nome":"Gricia","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Carbonara","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola"]},{"nome":"Puttanesca","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con crema di zucchine e parmigiano","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola","Frullatore"]},{"nome":"Pasta al forno","categoria":"Primo","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Cannelloni ricotta e spinaci","categoria":"Primo/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Gnocchi alla romana","categoria":"Primo","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo al limone e rosmarino","categoria":"Carne","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Pollo con peperoni","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo al forno con senape e miele","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"marinatura","attrezzatura":[]},{"nome":"Straccetti di manzo ai funghi","categoria":"Carne","pref":"😐","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["autunno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Straccetti di manzo al balsamico","categoria":"Carne","pref":"❤️","tempo":"≤25 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Tagliata di manzo con rucola, grana e pomodorini","categoria":"Carne","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Estate","categoriaNew":"carne","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Hamburger fatti in casa","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"base","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette in bianco","categoria":"Carne","pref":"😐","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette alla pizzaiola","categoria":"Carne","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Involtini alla siciliana","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salsiccia e friarielli","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Salsiccia al sugo + polenta/pane","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Maiale in agrodolce con mele/cipolle","categoria":"Carne","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Lonza di maiale al forno con mele e rosmarino","categoria":"Carne","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Costine al forno","categoria":"Carne/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Ossobuco alla milanese + risotto allo zafferano","categoria":"Carne/progetto","pref":"😐","tempo":"Progetto","prep":"Weekend","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"carne","tempoBucket":"progetto","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Gateau di patate","categoria":"Piatto rustico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Torta salata patate e speck","categoria":"Piatto rustico","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Torta salata ricotta e spinaci","categoria":"Piatto rustico","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Sformato di verdure e formaggio","categoria":"Piatto rustico","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpettone ripieno","categoria":"Carne/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpettone al sugo","categoria":"Carne","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Patate ripiene al forno","categoria":"Piatto rustico","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Patate alla pizzaiola","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Uova al forno con patate e mozzarella","categoria":"Piatto rustico","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pizzaiola","categoria":"Carne","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"carne","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Melanzane alla pizzaiola","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Melanzane ripiene alla calabrese","categoria":"Verdure","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Zucchine alla scapece","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"Riposo consigliato","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":["Padella","Fritto"]},{"nome":"Zucchine ripiene di ricotta e parmigiano","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Peperoni gratinati con pangrattato, olive e capperi","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Peperoni con mollica e acciughe","categoria":"Verdure","pref":"😐","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Caponata siciliana","categoria":"Verdure","pref":"❤️","tempo":"45–60 min","prep":"Riposo consigliato","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Ratatouille","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Patate e peperoni in padella","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Patate al forno schiacciate con rosmarino e parmigiano","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Carciofi alla romana","categoria":"Verdure","pref":"😐","tempo":"30–45 min","prep":"Pulizia carciofi","freezer":"No","avanzi":"Sì","stagione":"Inverno/Primavera","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["inverno","primavera"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Carciofi ripieni","categoria":"Verdure","pref":"😐","tempo":"45–60 min","prep":"Pulizia carciofi","freezer":"Sì","avanzi":"Sì","stagione":"Inverno/Primavera","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["inverno","primavera"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ogni-tanto","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Fagiolini al pomodoro","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola","Padella"]},{"nome":"Piselli al prosciutto","categoria":"Verdure","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Primavera","categoriaNew":"verdure","tempoBucket":"veloce","stagioni":["primavera"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella"]},{"nome":"Spinaci al burro e parmigiano","categoria":"Verdure","pref":"❤️","tempo":"≤20 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"verdure","tempoBucket":"express","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola","Padella"]},{"nome":"Bietole gratinate","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Forno","Pentola"]},{"nome":"Broccoli gratinati con besciamella","categoria":"Verdure","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"verdure","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Cavolfiore alla pizzaiola","categoria":"Verdure","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pomodori gratinati","categoria":"Verdure","pref":"❤️","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"verdure","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pomodori ripieni di riso","categoria":"Piatto rustico","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta alla carrettiera","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola"]},{"nome":"Pasta con salsiccia e funghi","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta salsiccia e broccoli","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con zucchine e speck","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola"]},{"nome":"Pasta con melanzane e ricotta salata","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con ricotta, spinaci e parmigiano","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con crema di peperoni","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con peperoni e salsiccia","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola","Frullatore"]},{"nome":"Pasta con patate","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola"]},{"nome":"Pasta e patate con provola","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con fagiolini, patate e pesto","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta al forno bianca con besciamella, prosciutto e mozzarella","categoria":"Primo","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Cannelloni di carne","categoria":"Primo/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Timballo di pasta","categoria":"Primo/progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta gratinata con verdure e formaggio","categoria":"Primo","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto ai funghi","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto alla milanese","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto radicchio e taleggio","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto zucchine e speck","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"riso","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto salsiccia e rosmarino","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola"]},{"nome":"Gnocchi al forno con pomodoro e mozzarella","categoria":"Primo","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta e patate","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Riso al forno con mozzarella, pomodoro e carne","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Riso al forno con verdure e formaggio","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Gnocchi alla sorrentina","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Gnocchi al ragù","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"Ragù pronto utile","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Gnocchi gorgonzola e noci","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"veloce","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola"]},{"nome":"Pasta con patate e pancetta","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con zucca e salsiccia","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con zucca e taleggio","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con broccoli e salsiccia","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con cavolfiore, acciughe e pangrattato","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con ricotta e pomodoro","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Pentola"]},{"nome":"Pasta con crema di melanzane e mozzarella","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta con stracchino e zucchine","categoria":"Primo","pref":"❤️","tempo":"≤30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Estate","categoriaNew":"pasta","tempoBucket":"veloce","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Pentola"]},{"nome":"Risotto zucca e taleggio","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto pere e taleggio","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto salsiccia e funghi","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto radicchio e salsiccia","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Risotto ai quattro formaggi","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polenta con ragù","categoria":"Piatto unico","pref":"❤️","tempo":"30–45 min","prep":"Ragù pronto utile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Polenta con salsiccia e funghi","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polenta con gorgonzola e speck","categoria":"Piatto unico","pref":"❤️","tempo":"30 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"veloce","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polenta con brasato","categoria":"Piatto unico","pref":"❤️","tempo":"Progetto","prep":"Brasato pronto","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"progetto","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Polenta pasticciata al forno","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Teglia di patate, salsiccia e verdure","categoria":"Piatto unico","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Teglia di pollo, patate e peperoni","categoria":"Piatto unico","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate/Autunno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["estate","autunno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Parmigiana di zucchine","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"congelabile","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Parmigiana di patate","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Torta di patate e carne","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Moussaka italiana di melanzane e carne","categoria":"Piatto unico","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Estate","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["estate"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta e zucca","categoria":"Primo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"non-adatta","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Vellutata di zucca + crostini + formaggio","categoria":"Piatto caldo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"forno","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Zuppa di patate, porri e parmigiano","categoria":"Piatto caldo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"forno","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Zuppa di ceci e zucca","categoria":"Legumi","pref":"❤️","tempo":"45–60 min","prep":"Ceci in ammollo","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"ammollo","attrezzatura":[]},{"nome":"Zuppa di lenticchie e patate","categoria":"Legumi","pref":"❤️","tempo":"30–45 min","prep":"No/variabile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Minestrone ricco con legumi","categoria":"Legumi","pref":"❤️","tempo":"45–60 min","prep":"Variabile","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"legumi","tempoBucket":"lunga","stagioni":["autunno","inverno"],"freezerNew":"congelabile","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polenta e funghi","categoria":"Piatto caldo","pref":"❤️","tempo":"30–45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Autunno/Inverno","categoriaNew":"riso","tempoBucket":"normale","stagioni":["autunno","inverno"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salmone in crosta","categoria":"Pesce","pref":"❤️","tempo":"45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salmone con patate al forno","categoria":"Pesce","pref":"❤️","tempo":"45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Salmone gratinato con pangrattato, prezzemolo e limone","categoria":"Pesce","pref":"❤️","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Merluzzo alla mediterranea","categoria":"Pesce","pref":"😐","tempo":"30–40 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ogni-tanto","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Merluzzo gratinato con patate","categoria":"Pesce","pref":"❤️","tempo":"45 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Polpette di tonno, ricotta e parmigiano","categoria":"Pesce","pref":"❤️","tempo":"45 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pesce","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Gnocchi di patate fatti in casa","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"Weekend","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"riso","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Pasta fresca fatta in casa","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"Occasione speciale","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Ravioli/tortelli fatti in casa","categoria":"Progetto","pref":"❤️","tempo":">2 ore","prep":"Weekend","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"progetto","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Pizza fatta in casa","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"Lievitazione","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"impasto-lievitazione","attrezzatura":[]},{"nome":"Focaccia","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"Lievitazione","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"base","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"impasto-lievitazione","attrezzatura":[]},{"nome":"Arancini","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"Meglio preparazioni già pronte","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"prep-anticipata","attrezzatura":[]},{"nome":"Olive all'ascolana","categoria":"Progetto","pref":"❤️","tempo":">60 min","prep":"No","freezer":"Sì","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"meal-prep","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pollo fritto","categoria":"Progetto","pref":"❤️","tempo":"30–60 min","prep":"No","freezer":"No","avanzi":"Meglio fresco","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"marinatura","attrezzatura":[]},{"nome":"Verdure in pastella","categoria":"Progetto","pref":"❤️","tempo":"30–60 min","prep":"No","freezer":"No","avanzi":"Meglio fresco","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Pasta alla Norma","categoria":"Primo","pref":"❤️","tempo":"40–45 min","prep":"No","freezer":"Solo il sugo","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"pasta","tempoBucket":"normale","stagioni":["tutto"],"freezerNew":"base","avanziNew":"ottima","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Padella","Fritto"]},{"nome":"Prosciutto e melone","categoria":"Carne","pref":"❤️","tempo":"≤20 min","prep":"No","freezer":"No","avanzi":"Meglio fresca","stagione":"Estate","categoriaNew":"carne","tempoBucket":"express","stagioni":["estate"],"freezerNew":"non-adatta","avanziNew":"meglio-fatta","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":[]},{"nome":"Spiedini con patate","categoria":"Piatto unico","pref":"❤️","tempo":"45–60 min","prep":"No","freezer":"No","avanzi":"Sì","stagione":"Tutto l'anno","categoriaNew":"forno","tempoBucket":"lunga","stagioni":["tutto"],"freezerNew":"non-adatta","avanziNew":"buona","gradimento":"ci-piace","pianificazione":"nessuna","attrezzatura":["Forno"]}],"week1":[{"giorno":"Lunedì","cena":"Pasta alla Norma + insalata","tempo":"~40 min","ricordare":"Dopo cena: mettere i ceci in ammollo","pranzo":"Possibile avanzo","nota":"Cena estiva","catalogMatch":"Pasta alla Norma","fallbackCategoria":"pasta"},{"giorno":"Martedì","cena":"Pasta e ceci + verdura","tempo":"~45–60 min","ricordare":"Usare ceci ammollati","pranzo":"Avanzo per mercoledì","nota":"Fare più porzioni; eventuale extra freezer","catalogMatch":"Pasta e ceci","fallbackCategoria":null},{"giorno":"Mercoledì","cena":"Salmone gratinato + zucchine + patate","tempo":"~40 min","ricordare":"Niente","pranzo":"Eventuale avanzo","nota":"Cena semplice","catalogMatch":"Salmone gratinato con pangrattato, prezzemolo e limone","fallbackCategoria":null},{"giorno":"Giovedì","cena":"Straccetti di manzo al balsamico + peperoni + pane","tempo":"~25 min","ricordare":"Niente","pranzo":"Se avanzano","nota":"Serata rapida","catalogMatch":"Straccetti di manzo al balsamico","fallbackCategoria":null},{"giorno":"Venerdì","cena":"Pollo alla senape e miele + patate al forno + insalata","tempo":"~45 min","ricordare":"Niente","pranzo":"Avanzo sabato","nota":"Fare più pollo","catalogMatch":"Pollo al forno con senape e miele","fallbackCategoria":null},{"giorno":"Sabato","cena":"Pizza fatta in casa","tempo":"Variabile","ricordare":"Preparare impasto secondo lievitazione scelta","pranzo":"—","nota":"Progetto del weekend","catalogMatch":"Pizza fatta in casa","fallbackCategoria":null},{"giorno":"Domenica","cena":"Parmigiana di melanzane + insalata","tempo":">60 min","ricordare":"Valutare teglia abbondante","pranzo":"Avanzo per lunedì","nota":"Perfetta per freezer","catalogMatch":"Parmigiana di melanzane","fallbackCategoria":null}],"shop1":[{"dove":"Rossetto","ingrediente":"Melanzane","qta":"6–8 medie","per":"Norma + parmigiana","note":""},{"dove":"Rossetto","ingrediente":"Zucchine","qta":"5–6","per":"Salmone/contorni","note":""},{"dove":"Rossetto","ingrediente":"Peperoni","qta":"3–4","per":"Straccetti","note":""},{"dove":"Rossetto","ingrediente":"Patate","qta":"1,5–2 kg","per":"Salmone + pollo","note":""},{"dove":"Rossetto","ingrediente":"Insalata","qta":"2 acquisti/cespi","per":"Contorni","note":"Ste la vuole spesso"},{"dove":"Rossetto","ingrediente":"Pomodori/passata","qta":"Controllare scorta","per":"Norma + parmigiana","note":""},{"dove":"Rossetto","ingrediente":"Basilico","qta":"1 mazzetto","per":"Norma","note":""},{"dove":"Rossetto","ingrediente":"Salmone","qta":"2 tranci","per":"Mercoledì","note":""},{"dove":"Rossetto","ingrediente":"Manzo per straccetti","qta":"Per 2 + eventuale avanzo","per":"Giovedì","note":""},{"dove":"Rossetto","ingrediente":"Pollo","qta":"Per 4 porzioni circa","per":"Venerdì + pranzo","note":""},{"dove":"Rossetto","ingrediente":"Mozzarella","qta":"Per parmigiana","per":"Domenica","note":""},{"dove":"Rossetto","ingrediente":"Ricotta salata","qta":"1 pezzo","per":"Norma","note":""},{"dove":"Rossetto","ingrediente":"Ceci secchi","qta":"Controllare scorta","per":"Martedì","note":"Ammollo lunedì"},{"dove":"Rossetto","ingrediente":"Pangrattato","qta":"Controllare scorta","per":"Salmone/parmigiana","note":""},{"dove":"Rossetto","ingrediente":"Farina e lievito","qta":"Controllare scorta","per":"Pizza","note":""},{"dove":"Rossetto","ingrediente":"Senape e miele","qta":"Controllare scorta","per":"Pollo","note":""},{"dove":"Rossetto","ingrediente":"Aceto balsamico","qta":"Controllare scorta","per":"Straccetti","note":""},{"dove":"Fruttivendolo","ingrediente":"Frutta e verdura di stagione","qta":"Secondo consumo","per":"Scorta weekend","note":""},{"dove":"Conad","ingrediente":"Piccole integrazioni","qta":"Solo se serve","per":"Emergenze","note":""}],"pantry":[{"cat":"Base","elemento":"Pasta","situazione":"Normalmente presente"},{"cat":"Base","elemento":"Riso","situazione":"Normalmente presente"},{"cat":"Base","elemento":"Farina","situazione":"Normalmente presente"},{"cat":"Conserve","elemento":"Passata","situazione":"Normalmente presente"},{"cat":"Legumi","elemento":"Legumi secchi da ammollo","situazione":"Normalmente presenti"},{"cat":"Condimenti","elemento":"Pesto","situazione":"Comprato"},{"cat":"Conserve","elemento":"Tonno in scatola","situazione":"Normalmente presente"},{"cat":"Condimenti","elemento":"Spezie","situazione":"Normalmente presenti"},{"cat":"Latticini","elemento":"Latte","situazione":"Normalmente presente"},{"cat":"Brodo","elemento":"Dadi","situazione":"Comprati"},{"cat":"Condimenti","elemento":"Olive","situazione":"Normalmente presenti"},{"cat":"Condimenti","elemento":"Capperi","situazione":"Normalmente presenti"},{"cat":"Condimenti","elemento":"Aceto","situazione":"Normalmente presente"},{"cat":"Comprato","elemento":"Pane","situazione":"Comprato"},{"cat":"Comprato","elemento":"Sugo cacio e pepe","situazione":"Comprato"},{"cat":"Comprato","elemento":"Pasta sfoglia/brisé","situazione":"Comprata quando serve"},{"cat":"Comprato","elemento":"Salse","situazione":"Comprate"},{"cat":"Comprato","elemento":"Marmellate","situazione":"Comprate"},{"cat":"Fatto in casa","elemento":"Ragù","situazione":"Autoprodotto"},{"cat":"Fatto in casa","elemento":"Pasta fresca","situazione":"Solo soprattutto Natale/Pasqua"},{"cat":"Fatto in casa","elemento":"Torte dolci","situazione":"Autoprodotte"},{"cat":"Fatto in casa","elemento":"Pasta frolla","situazione":"A volte autoprodotta"}],"info":{"Obiettivo":"Mangiare in modo vario e piacevole, senza rinunciare a lasagne, fritti e ricette goduriose.","Metodo":"Decidere le cene in anticipo e usare il menù anche per ricordare ammolli, scongelamenti e preparazioni.","Pranzo Mara":"Normalmente avanzi della cena precedente.","Pranzo Ste":"Non pianificato: mangia fuori durante il lavoro.","Tempo disponibile":"Circa 30 minuti nelle sere normali; 1–2 ore nel weekend e, ogni tanto, dopo cena per preparare i giorni successivi.","Freezer":"3 cassetti. Tenere un inventario semplice con contenuto, porzioni e data di congelamento.","Regola d'oro":"Quando una ricetta lunga congela bene, valutare una doppia produzione."},"recipeIngredientsInitial":{"Pasta alla Norma + insalata":[{"ingrediente":"Melanzane","qta":"6–8 medie","dove":"Rossetto","note":""},{"ingrediente":"Pomodori/passata","qta":"Controllare scorta","dove":"Rossetto","note":""},{"ingrediente":"Basilico","qta":"1 mazzetto","dove":"Rossetto","note":""},{"ingrediente":"Ricotta salata","qta":"1 pezzo","dove":"Rossetto","note":""}],"Pasta e ceci + verdura":[{"ingrediente":"Ceci secchi","qta":"Controllare scorta","dove":"Rossetto","note":"Ammollo lunedì"}],"Salmone gratinato + zucchine + patate":[{"ingrediente":"Zucchine","qta":"5–6","dove":"Rossetto","note":""},{"ingrediente":"Patate","qta":"1,5–2 kg","dove":"Rossetto","note":""},{"ingrediente":"Salmone","qta":"2 tranci","dove":"Rossetto","note":""},{"ingrediente":"Pangrattato","qta":"Controllare scorta","dove":"Rossetto","note":""}],"Straccetti di manzo al balsamico + peperoni + pane":[{"ingrediente":"Peperoni","qta":"3–4","dove":"Rossetto","note":""},{"ingrediente":"Manzo per straccetti","qta":"Per 2 + eventuale avanzo","dove":"Rossetto","note":""},{"ingrediente":"Aceto balsamico","qta":"Controllare scorta","dove":"Rossetto","note":""}],"Pollo alla senape e miele + patate al forno + insalata":[{"ingrediente":"Patate","qta":"1,5–2 kg","dove":"Rossetto","note":""},{"ingrediente":"Pollo","qta":"Per 4 porzioni circa","dove":"Rossetto","note":""},{"ingrediente":"Senape e miele","qta":"Controllare scorta","dove":"Rossetto","note":""}],"Pizza fatta in casa":[{"ingrediente":"Farina 00 (o mix con Manitoba)","qta":"500 g","dove":"","note":""},{"ingrediente":"Acqua","qta":"320 ml","dove":"","note":""},{"ingrediente":"Lievito di birra fresco","qta":"4 g (o 1,5 g secco)","dove":"","note":""},{"ingrediente":"Sale","qta":"12 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"2 cucchiai","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"300 g","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Origano","qta":"q.b.","dove":"","note":""}],"Parmigiana di melanzane + insalata":[{"ingrediente":"Melanzane","qta":"6–8 medie","dove":"Rossetto","note":""},{"ingrediente":"Pomodori/passata","qta":"Controllare scorta","dove":"Rossetto","note":""},{"ingrediente":"Mozzarella","qta":"Per parmigiana","dove":"Rossetto","note":""},{"ingrediente":"Pangrattato","qta":"Controllare scorta","dove":"Rossetto","note":""}],"Pasta alla Norma":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Melanzana","qta":"1 (circa 350–400 g)","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"350 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Ricotta salata","qta":"60–70 g","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Amatriciana":[{"ingrediente":"Spaghetti o bucatini","qta":"210 g","dove":"","note":""},{"ingrediente":"Guanciale","qta":"100 g","dove":"","note":""},{"ingrediente":"Pomodori pelati o passata rustica","qta":"300 g","dove":"","note":""},{"ingrediente":"Pecorino romano","qta":"55–60 g","dove":"","note":""},{"ingrediente":"Peperoncino","qta":"facoltativo","dove":"","note":""}],"Carbonara":[{"ingrediente":"Spaghetti","qta":"210 g","dove":"","note":""},{"ingrediente":"Guanciale","qta":"100 g","dove":"","note":""},{"ingrediente":"Tuorli","qta":"3","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Pecorino romano","qta":"70 g","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta e ceci":[{"ingrediente":"Ceci secchi","qta":"150 g","dove":"","note":""},{"ingrediente":"Pasta piccola","qta":"180–210 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"200 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1 rametto","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Acqua o brodo","qta":"q.b.","dove":"","note":""}],"Pasta con crema di zucchine e parmigiano":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Zucchine","qta":"3","dove":"","note":""},{"ingrediente":"Scalogno piccolo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"55–60 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Basilico o menta","qta":"facoltativi","dove":"","note":""}],"Pasta con zucchine e speck":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Zucchine","qta":"3","dove":"","note":""},{"ingrediente":"Speck","qta":"90–110 g","dove":"","note":""},{"ingrediente":"Scalogno piccolo","qta":"1","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo","dove":"","note":""}],"Pasta con peperoni e salsiccia":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Peperoni","qta":"1 grande + 1 piccolo (o 2 piccoli)","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"200–220 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"circa 50 ml","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Bistecca":[{"ingrediente":"Bistecche di manzo","qta":"3 (circa 200 g l'una)","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Risotto ai quattro formaggi":[{"ingrediente":"Riso Carnaroli o Vialone Nano","qta":"240 g","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Scalogno (o mezza cipolla)","qta":"1","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Taleggio","qta":"100 g","dove":"","note":""},{"ingrediente":"Gorgonzola","qta":"60 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Provolone o brie","qta":"40 g","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, per sfumare","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo fritto":[{"ingrediente":"Petto di pollo o cosce disossate","qta":"500 g","dove":"","note":""},{"ingrediente":"Latticello (o yogurt bianco diluito con poco latte)","qta":"200 ml","dove":"","note":""},{"ingrediente":"Farina","qta":"150 g","dove":"","note":""},{"ingrediente":"Paprika dolce","qta":"1 cucchiaino","dove":"","note":""},{"ingrediente":"Aglio in polvere","qta":"1 cucchiaino","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio di semi per friggere","qta":"abbondante","dove":"","note":""}],"Salmone con zucchine":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Zucchine","qta":"3","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"facoltativo","dove":"","note":""}],"Peperonata":[{"ingrediente":"Peperoni misti (rossi e gialli)","qta":"3","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Pomodori pelati o passata","qta":"300 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Zucchero","qta":"facoltativo, un cucchiaino per bilanciare l'acidità","dove":"","note":""}],"Uova al tegamino con pomodoro":[{"ingrediente":"Uova","qta":"6","dove":"","note":""},{"ingrediente":"Passata di pomodoro (o pomodorini)","qta":"400 ml","dove":"","note":""},{"ingrediente":"Aglio (o mezza cipolla)","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Zucchero","qta":"facoltativo, un pizzico","dove":"","note":""}],"Prosciutto e melone":[{"ingrediente":"Melone maturo","qta":"1","dove":"","note":""},{"ingrediente":"Prosciutto crudo a fette","qta":"150–180 g","dove":"","note":""},{"ingrediente":"Pepe","qta":"facoltativo","dove":"","note":""}],"Spiedini con patate":[{"ingrediente":"Petto di pollo o lonza di maiale a cubetti","qta":"400 g","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"200 g","dove":"","note":""},{"ingrediente":"Pancetta a cubetti","qta":"facoltativa, 100 g","dove":"","note":""},{"ingrediente":"Spiedini già pronti (dal freezer)","qta":"facoltativi, in alternativa alla carne cruda se già assemblati in anticipo","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Peperone","qta":"1","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"qualche rametto","dove":"","note":""},{"ingrediente":"Salvia","qta":"qualche foglia","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta tonno e limone":[{"ingrediente":"Pasta (linguine o spaghetti)","qta":"210 g","dove":"","note":""},{"ingrediente":"Tonno in scatola","qta":"circa 160 g","dove":"","note":""},{"ingrediente":"Limone (scorza e succo)","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Peperoncino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Pasta fredda":[{"ingrediente":"Pasta corta (fusilli o penne)","qta":"240 g","dove":"","note":""},{"ingrediente":"Tonno in scatola","qta":"160 g","dove":"","note":""},{"ingrediente":"Pomodorini","qta":"200 g","dove":"","note":""},{"ingrediente":"Mozzarella o bocconcini","qta":"150 g","dove":"","note":""},{"ingrediente":"Olive","qta":"50 g","dove":"","note":""},{"ingrediente":"Mais","qta":"facoltativo, 80 g","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Melanzane alla pizzaiola":[{"ingrediente":"Melanzane","qta":"2 grandi","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"300 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"150 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Origano","qta":"q.b.","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Risotto zucchine e speck":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Zucchine","qta":"2","dove":"","note":""},{"ingrediente":"Speck","qta":"100 g","dove":"","note":""},{"ingrediente":"Cipolla o scalogno","qta":"1","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Burro","qta":"20 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta al pesto":[{"ingrediente":"Pasta (trofie o trenette)","qta":"240 g","dove":"","note":""},{"ingrediente":"Basilico","qta":"40 g","dove":"","note":""},{"ingrediente":"Pinoli","qta":"20 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"30 g","dove":"","note":""},{"ingrediente":"Pecorino grattugiato","qta":"20 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1/2 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"circa 80 ml","dove":"","note":""},{"ingrediente":"Sale grosso","qta":"q.b.","dove":"","note":""}],"Pasta a cacio e pepe":[{"ingrediente":"Pasta (tonnarelli o spaghetti)","qta":"240 g","dove":"","note":""},{"ingrediente":"Pecorino romano grattugiato","qta":"150 g","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b., abbondante","dove":"","note":""}],"Pasta e fagioli":[{"ingrediente":"Fagioli borlotti o cannellini già cotti","qta":"400 g","dove":"","note":""},{"ingrediente":"Pasta corta (ditalini o mista)","qta":"150 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro o concentrato","qta":"2 cucchiai di concentrato o 200 g passata","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Sedano","qta":"facoltativo, 1 gambo","dove":"","note":""},{"ingrediente":"Carota","qta":"facoltativa, 1 pezzo","dove":"","note":""},{"ingrediente":"Rosmarino o alloro","qta":"q.b.","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua calda","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Trancio di salmone al forno":[{"ingrediente":"Tranci di salmone","qta":"3 (circa 180 g l'uno)","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Gnocchi alla sorrentina":[{"ingrediente":"Gnocchi di patate","qta":"600 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"200 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Zucchine gratinate al forno":[{"ingrediente":"Zucchine","qta":"5–6","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"80 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Risotto alla milanese":[{"ingrediente":"Riso Carnaroli o Vialone Nano","qta":"240 g","dove":"","note":""},{"ingrediente":"Zafferano","qta":"1 bustina o una presa di pistilli","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Brodo di carne o vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Burro","qta":"50 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Parmigiana di melanzane":[{"ingrediente":"Melanzane","qta":"3 grandi","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"500 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"300 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"80 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"abbondante","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Pollo alla cacciatora":[{"ingrediente":"Pollo a pezzi (cosce o petto)","qta":"700 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 gambo","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Pomodori pelati","qta":"400 g","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olive nere","qta":"facoltative, 80 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Cotoletta alla milanese":[{"ingrediente":"Fettine di vitello (o lombata)","qta":"3","dove":"","note":""},{"ingrediente":"Uova","qta":"2","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"150 g","dove":"","note":""},{"ingrediente":"Farina","qta":"facoltativa, q.b.","dove":"","note":""},{"ingrediente":"Burro","qta":"80 g","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Limone","qta":"per servire","dove":"","note":""}],"Orata/branzino al forno con patate":[{"ingrediente":"Orata o branzino (anche filetti)","qta":"2 (circa 400 g l'una)","dove":"","note":""},{"ingrediente":"Patate","qta":"600 g","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Frittata di zucchine e parmigiano":[{"ingrediente":"Uova","qta":"6","dove":"","note":""},{"ingrediente":"Zucchine","qta":"2","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"facoltativa, 1/2","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Ceci in umido al pomodoro e rosmarino + pane":[{"ingrediente":"Ceci già cotti","qta":"500 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"300 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1 rametto","dove":"","note":""},{"ingrediente":"Alloro","qta":"1 foglia, facoltativo","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pane casereccio","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Caponata siciliana":[{"ingrediente":"Melanzane","qta":"2 grandi","dove":"","note":""},{"ingrediente":"Sedano","qta":"2 coste","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Pomodori maturi o pelati","qta":"300 g","dove":"","note":""},{"ingrediente":"Olive verdi","qta":"80 g","dove":"","note":""},{"ingrediente":"Capperi","qta":"30 g","dove":"","note":""},{"ingrediente":"Aceto di vino bianco","qta":"2 cucchiai","dove":"","note":""},{"ingrediente":"Zucchero","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"abbondante","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Saltimbocca alla romana":[{"ingrediente":"Fettine di vitello","qta":"6 piccole","dove":"","note":""},{"ingrediente":"Prosciutto crudo a fette","qta":"6 fette","dove":"","note":""},{"ingrediente":"Salvia","qta":"6-12 foglie","dove":"","note":""},{"ingrediente":"Farina","qta":"q.b.","dove":"","note":""},{"ingrediente":"Burro","qta":"40 g","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Torta salata ricotta e spinaci":[{"ingrediente":"Pasta sfoglia","qta":"1 rotolo","dove":"","note":""},{"ingrediente":"Ricotta","qta":"250 g","dove":"","note":""},{"ingrediente":"Spinaci","qta":"300 g","dove":"","note":""},{"ingrediente":"Uova","qta":"2","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"facoltativa","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Zuppa di ceci e zucca":[{"ingrediente":"Zucca","qta":"500 g di polpa","dove":"","note":""},{"ingrediente":"Ceci già cotti","qta":"400 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 500 ml","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1 rametto","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pane per crostini","qta":"facoltativo","dove":"","note":""}],"Pasta e lenticchie":[{"ingrediente":"Lenticchie già cotte","qta":"400 g","dove":"","note":""},{"ingrediente":"Pasta corta (ditalini o tubetti)","qta":"150 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 gambo","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Concentrato o passata di pomodoro","qta":"2 cucchiai o 200 g","dove":"","note":""},{"ingrediente":"Alloro","qta":"1 foglia","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Fagioli all'uccelletto + pane/salsiccia":[{"ingrediente":"Fagioli cannellini già cotti","qta":"500 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Salvia","qta":"qualche foglia","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"facoltativo, un rametto","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"200 g","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"facoltativa, 200 g","dove":"","note":""},{"ingrediente":"Pane casereccio","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Uova in purgatorio":[{"ingrediente":"Uova","qta":"6","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"300 ml","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pane per servire","qta":"q.b.","dove":"","note":""}],"Frittata di patate":[{"ingrediente":"Uova","qta":"6","dove":"","note":""},{"ingrediente":"Patate","qta":"3 medie","dove":"","note":""},{"ingrediente":"Cipolla","qta":"facoltativa, 1/2","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo, 40 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Filetti di merluzzo gratinati":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"80 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Limone (scorza e succo)","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Salmone gratinato con pangrattato, prezzemolo e limone":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"80 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Limone (scorza e succo)","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polenta con ragù":[{"ingrediente":"Farina di mais per polenta","qta":"250 g","dove":"","note":""},{"ingrediente":"Acqua","qta":"circa 1 litro","dove":"","note":""},{"ingrediente":"Sale grosso","qta":"q.b.","dove":"","note":""},{"ingrediente":"Carne macinata","qta":"300 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""}],"Polpette al sugo":[{"ingrediente":"Carne macinata di manzo","qta":"400 g","dove":"","note":""},{"ingrediente":"Pane raffermo","qta":"50 g","dove":"","note":""},{"ingrediente":"Latte","qta":"q.b. per ammollare il pane","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"500 g","dove":"","note":""},{"ingrediente":"Cipolla o aglio","qta":"1/2 cipolla o 1 spicchio d'aglio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Torta salata patate e speck":[{"ingrediente":"Pasta sfoglia","qta":"1 rotolo","dove":"","note":""},{"ingrediente":"Patate","qta":"3 medie","dove":"","note":""},{"ingrediente":"Speck","qta":"120 g","dove":"","note":""},{"ingrediente":"Scamorza o provola","qta":"150 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Verdure miste al forno con patate":[{"ingrediente":"Patate","qta":"3 medie","dove":"","note":""},{"ingrediente":"Zucchine","qta":"2","dove":"","note":""},{"ingrediente":"Peperoni","qta":"1-2","dove":"","note":""},{"ingrediente":"Melanzana","qta":"1","dove":"","note":""},{"ingrediente":"Cipolla rossa","qta":"1","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Lenticchie in umido + uovo/pane":[{"ingrediente":"Lenticchie già cotte","qta":"500 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"200 g","dove":"","note":""},{"ingrediente":"Alloro","qta":"1 foglia","dove":"","note":""},{"ingrediente":"Uova","qta":"3 (una a testa, all'occhio di bue)","dove":"","note":""},{"ingrediente":"Pane casereccio","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Zuppa di lenticchie e patate":[{"ingrediente":"Lenticchie già cotte","qta":"400 g","dove":"","note":""},{"ingrediente":"Patate","qta":"2 medie","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"150 g","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Frittata con avanzi":[{"ingrediente":"Pasta o riso avanzati","qta":"circa 300 g","dove":"","note":""},{"ingrediente":"Uova","qta":"5","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Frittata al forno con verdure e formaggio":[{"ingrediente":"Uova","qta":"6","dove":"","note":""},{"ingrediente":"Verdure miste (zucchine, carote, spinaci)","qta":"circa 400 g","dove":"","note":""},{"ingrediente":"Latte","qta":"50 ml","dove":"","note":""},{"ingrediente":"Formaggio grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Salmone al cartoccio con limone ed erbe":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Timo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polpette di tonno e patate":[{"ingrediente":"Patate","qta":"3 medie","dove":"","note":""},{"ingrediente":"Tonno in scatola","qta":"250 g","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"per la panatura","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Merluzzo alla mediterranea":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Pomodorini","qta":"250 g","dove":"","note":""},{"ingrediente":"Olive nere","qta":"60 g","dove":"","note":""},{"ingrediente":"Capperi","qta":"20 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Origano","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Risotto ai funghi":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Funghi misti freschi","qta":"300 g","dove":"","note":""},{"ingrediente":"Scalogno o cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Risotto radicchio e taleggio":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Radicchio","qta":"1 cespo","dove":"","note":""},{"ingrediente":"Taleggio","qta":"150 g","dove":"","note":""},{"ingrediente":"Scalogno o cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Gnocchi al ragù":[{"ingrediente":"Gnocchi di patate","qta":"600 g","dove":"","note":""},{"ingrediente":"Carne macinata mista","qta":"300 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Minestrone ricco con legumi":[{"ingrediente":"Fagioli e ceci già cotti","qta":"300 g totali","dove":"","note":""},{"ingrediente":"Patate","qta":"1-2","dove":"","note":""},{"ingrediente":"Zucchine","qta":"1-2","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Bietole o altre verdure a foglia","qta":"facoltative, un mazzetto","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"facoltativa, 100 g","dove":"","note":""},{"ingrediente":"Acqua o brodo vegetale","qta":"circa 1,5 l","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Farinata di ceci con verdure/formaggi":[{"ingrediente":"Farina di ceci","qta":"150 g","dove":"","note":""},{"ingrediente":"Acqua","qta":"450 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"5 cucchiai","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Verdure a piacere (zucchine, cipolla) o formaggio","qta":"facoltativi, circa 150 g","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pesce al forno alla mediterranea":[{"ingrediente":"Filetti di pesce bianco (orata, branzino o simili)","qta":"3 (circa 180 g l'uno)","dove":"","note":""},{"ingrediente":"Pomodorini","qta":"200 g","dove":"","note":""},{"ingrediente":"Olive nere","qta":"60 g","dove":"","note":""},{"ingrediente":"Capperi","qta":"20 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Origano","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Salmone in crosta":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"80 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Timo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Limone (scorza)","qta":"1","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Salmone con patate al forno":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Merluzzo gratinato con patate":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"80 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polpette di tonno, ricotta e parmigiano":[{"ingrediente":"Tonno in scatola","qta":"250 g","dove":"","note":""},{"ingrediente":"Ricotta","qta":"150 g","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"per la panatura","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo alla valdostana":[{"ingrediente":"Petto di pollo","qta":"500 g","dove":"","note":""},{"ingrediente":"Prosciutto cotto","qta":"6 fette","dove":"","note":""},{"ingrediente":"Fontina","qta":"150 g","dove":"","note":""},{"ingrediente":"Farina","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Zucchine ripiene":[{"ingrediente":"Zucchine","qta":"4-5","dove":"","note":""},{"ingrediente":"Carne macinata","qta":"300 g","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Pane raffermo","qta":"1 fetta","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"facoltativa, 200 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Zuppa di legumi e cereali":[{"ingrediente":"Legumi misti già cotti (ceci, fagioli, lenticchie)","qta":"400 g","dove":"","note":""},{"ingrediente":"Cereali misti (farro, orzo perlato)","qta":"150 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Pomodori o pelati","qta":"200 g","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Alloro","qta":"q.b.","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 1 litro","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo al forno con senape e miele":[{"ingrediente":"Cosce o sovracosce di pollo","qta":"6","dove":"","note":""},{"ingrediente":"Senape","qta":"3 cucchiai","dove":"","note":""},{"ingrediente":"Miele","qta":"3 cucchiai","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Aglio","qta":"1-2 spicchi","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Straccetti di manzo al balsamico":[{"ingrediente":"Straccetti di manzo","qta":"400 g","dove":"","note":""},{"ingrediente":"Farina","qta":"40 g","dove":"","note":""},{"ingrediente":"Aceto balsamico","qta":"2-3 cucchiai","dove":"","note":""},{"ingrediente":"Rucola","qta":"un mazzetto","dove":"","note":""},{"ingrediente":"Parmigiano a scaglie","qta":"40 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Ossobuco alla milanese + risotto allo zafferano":[{"ingrediente":"Ossibuchi di vitello","qta":"3","dove":"","note":""},{"ingrediente":"Farina","qta":"per infarinare","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Brodo di carne","qta":"circa 500 ml","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Aglio","qta":"q.b.","dove":"","note":""},{"ingrediente":"Scorza di limone","qta":"q.b.","dove":"","note":""},{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Zafferano","qta":"1 bustina","dove":"","note":""},{"ingrediente":"Burro","qta":"50 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polpettone al sugo":[{"ingrediente":"Carne macinata mista","qta":"600 g","dove":"","note":""},{"ingrediente":"Uova","qta":"2","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"50 g","dove":"","note":""},{"ingrediente":"Mozzarella o provola (facoltativa)","qta":"100 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"500 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Hamburger fatti in casa":[{"ingrediente":"Carne macinata di manzo","qta":"450 g","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Panini per hamburger","qta":"3","dove":"","note":""},{"ingrediente":"Formaggio grattugiato","qta":"a piacere","dove":"","note":""},{"ingrediente":"Insalata","qta":"a piacere","dove":"","note":""},{"ingrediente":"Pomodoro","qta":"a piacere","dove":"","note":""}],"Spezzatino di manzo con patate":[{"ingrediente":"Polpa di manzo per spezzatino","qta":"500 g","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"200 g","dove":"","note":""},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Farina","qta":"per infarinare","dove":"","note":""},{"ingrediente":"Brodo o acqua","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Parmigiana di zucchine":[{"ingrediente":"Zucchine","qta":"1 kg","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"250 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Vellutata di zucca":[{"ingrediente":"Zucca","qta":"600 g di polpa","dove":"","note":""},{"ingrediente":"Patate","qta":"150 g","dove":"","note":""},{"ingrediente":"Porro o cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 500 ml","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Focaccia":[{"ingrediente":"Farina 0 (o mix con Manitoba)","qta":"500 g","dove":"","note":""},{"ingrediente":"Acqua","qta":"400 ml","dove":"","note":""},{"ingrediente":"Lievito di birra fresco","qta":"10 g (o 3 g secco)","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"90 ml","dove":"","note":""},{"ingrediente":"Sale","qta":"10 g","dove":"","note":""},{"ingrediente":"Zucchero o miele","qta":"1 cucchiaino","dove":"","note":""},{"ingrediente":"Sale grosso","qta":"q.b.","dove":"","note":""}],"Gricia":[{"ingrediente":"Rigatoni o spaghetti","qta":"240 g","dove":"","note":""},{"ingrediente":"Guanciale","qta":"150 g","dove":"","note":""},{"ingrediente":"Pecorino romano grattugiato","qta":"100 g","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Puttanesca":[{"ingrediente":"Spaghetti","qta":"240 g","dove":"","note":""},{"ingrediente":"Pomodori pelati o pomodorini freschi","qta":"400 g","dove":"","note":""},{"ingrediente":"Olive nere di Gaeta","qta":"80 g","dove":"","note":""},{"ingrediente":"Capperi","qta":"30 g","dove":"","note":""},{"ingrediente":"Acciughe sott'olio","qta":"3-4 filetti","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Peperoncino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""}],"Ragù":[{"ingrediente":"Carne macinata di manzo","qta":"400 g","dove":"","note":""},{"ingrediente":"Pancetta a cubetti","qta":"150 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Vino rosso o bianco","qta":"1 bicchiere","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"200 g","dove":"","note":""},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Latte","qta":"facoltativo, 1 bicchiere","dove":"","note":""},{"ingrediente":"Brodo di carne o vegetale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Cannelloni ricotta e spinaci":[{"ingrediente":"Cannelloni (secchi o sfoglie di pasta fresca)","qta":"16-18","dove":"","note":""},{"ingrediente":"Spinaci","qta":"500 g","dove":"","note":""},{"ingrediente":"Ricotta","qta":"300 g","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Besciamella","qta":"circa 400 ml","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO o burro","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta al forno bianca con besciamella, prosciutto e mozzarella":[{"ingrediente":"Pasta corta (mezze maniche o penne)","qta":"350 g","dove":"","note":""},{"ingrediente":"Besciamella","qta":"circa 600 ml","dove":"","note":""},{"ingrediente":"Prosciutto cotto","qta":"150 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"200 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Pasta con salsiccia e funghi":[{"ingrediente":"Pasta corta (penne o mezze maniche)","qta":"240 g","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"300 g","dove":"","note":""},{"ingrediente":"Funghi misti freschi","qta":"300 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Spaghetti con pomodorini":[{"ingrediente":"Spaghetti","qta":"240 g","dove":"","note":""},{"ingrediente":"Pomodorini","qta":"500 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Pasta con melanzane e ricotta salata":[{"ingrediente":"Pasta corta (rigatoni o penne)","qta":"240 g","dove":"","note":""},{"ingrediente":"Melanzane","qta":"2","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"350 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Ricotta salata","qta":"70 g","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"abbondante","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Pasta e patate":[{"ingrediente":"Pasta mista o corta","qta":"200 g","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Pomodorini o concentrato di pomodoro","qta":"150 g o 1 cucchiaio","dove":"","note":""},{"ingrediente":"Croste di parmigiano (facoltative)","qta":"1-2","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con broccoli e salsiccia":[{"ingrediente":"Pasta corta (orecchiette o fusilli)","qta":"240 g","dove":"","note":""},{"ingrediente":"Broccoli","qta":"1 (circa 500 g)","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"250 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Peperoncino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Risotto alla zucca":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Zucca","qta":"400 g di polpa","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Risotto agli asparagi":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Asparagi","qta":"1 mazzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1/2","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Burro","qta":"20 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Gnocchi alla romana":[{"ingrediente":"Semolino","qta":"150 g","dove":"","note":""},{"ingrediente":"Latte","qta":"600 ml","dove":"","note":""},{"ingrediente":"Burro","qta":"60 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"70 g","dove":"","note":""},{"ingrediente":"Tuorli","qta":"2","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Risotto salsiccia e funghi":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"250 g","dove":"","note":""},{"ingrediente":"Funghi misti freschi","qta":"250 g","dove":"","note":""},{"ingrediente":"Cipolla o scalogno","qta":"1","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml","dove":"","note":""},{"ingrediente":"Vino bianco o rosso","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Burro","qta":"20 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"50 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polenta con salsiccia e funghi":[{"ingrediente":"Farina di mais per polenta","qta":"250 g","dove":"","note":""},{"ingrediente":"Acqua","qta":"circa 1 litro","dove":"","note":""},{"ingrediente":"Sale grosso","qta":"q.b.","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"300 g","dove":"","note":""},{"ingrediente":"Funghi misti freschi","qta":"300 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta al forno":[{"ingrediente":"Pasta corta (rigatoni o mezze maniche)","qta":"350 g","dove":"","note":""},{"ingrediente":"Carne macinata mista","qta":"300 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Vino rosso","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Besciamella","qta":"circa 400 ml","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"200 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con ricotta, spinaci e parmigiano":[{"ingrediente":"Pasta corta (fusilli o mezze maniche)","qta":"240 g","dove":"","note":""},{"ingrediente":"Spinaci","qta":"300 g","dove":"","note":""},{"ingrediente":"Ricotta","qta":"200 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"facoltativa","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Cannelloni di carne":[{"ingrediente":"Cannelloni (secchi o sfoglie di pasta fresca)","qta":"16-18","dove":"","note":""},{"ingrediente":"Carne macinata mista","qta":"400 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"400 g","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere","dove":"","note":""},{"ingrediente":"Besciamella","qta":"circa 400 ml","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con patate e pancetta":[{"ingrediente":"Pasta mista o corta","qta":"200 g","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Pancetta a cubetti","qta":"100 g","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"per servire","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta e zucca":[{"ingrediente":"Pasta corta","qta":"200 g","dove":"","note":""},{"ingrediente":"Zucca","qta":"500 g di polpa","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 800 ml","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"per servire","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Scaloppine al limone":[{"ingrediente":"Fettine di vitello","qta":"500 g","dove":"","note":""},{"ingrediente":"Farina","qta":"per infarinare","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo al forno con patate e rosmarino":[{"ingrediente":"Pollo a pezzi (cosce o sovracosce)","qta":"800 g","dove":"","note":""},{"ingrediente":"Patate","qta":"600 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"abbondante","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Arista o arrosto di maiale al latte":[{"ingrediente":"Arista o lonza di maiale","qta":"800 g","dove":"","note":""},{"ingrediente":"Latte","qta":"500 ml","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"q.b.","dove":"","note":""},{"ingrediente":"Salvia","qta":"q.b.","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Brasato al vino rosso":[{"ingrediente":"Manzo per brasato (muscolo o cappello del prete)","qta":"800 g","dove":"","note":""},{"ingrediente":"Vino rosso corposo","qta":"circa 750 ml","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Alloro","qta":"1-2 foglie","dove":"","note":""},{"ingrediente":"Chiodi di garofano","qta":"2","dove":"","note":""},{"ingrediente":"Farina","qta":"per infarinare","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Polpette al forno":[{"ingrediente":"Carne macinata mista","qta":"400 g","dove":"","note":""},{"ingrediente":"Pane raffermo","qta":"50 g","dove":"","note":""},{"ingrediente":"Latte","qta":"q.b. per ammollare il pane","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"per la panatura","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Peperoni ripieni":[{"ingrediente":"Peperoni","qta":"3","dove":"","note":""},{"ingrediente":"Carne macinata mista","qta":"350 g","dove":"","note":""},{"ingrediente":"Uovo","qta":"1","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"40 g","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Melanzane ripiene":[{"ingrediente":"Melanzane","qta":"3","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"250 g","dove":"","note":""},{"ingrediente":"Mozzarella","qta":"150 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olive nere","qta":"facoltative, 50 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Carciofi alla romana":[{"ingrediente":"Carciofi grandi (mammole)","qta":"4","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"abbondante","dove":"","note":""},{"ingrediente":"Mentuccia (o menta)","qta":"q.b.","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"abbondante","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Gateau di patate":[{"ingrediente":"Patate","qta":"1 kg","dove":"","note":""},{"ingrediente":"Uova","qta":"2","dove":"","note":""},{"ingrediente":"Latte","qta":"100 ml","dove":"","note":""},{"ingrediente":"Burro","qta":"40 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Prosciutto cotto","qta":"120 g","dove":"","note":""},{"ingrediente":"Mozzarella o provola","qta":"200 g","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"per la teglia","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Sformato di verdure e formaggio":[{"ingrediente":"Verdure miste (zucchine, carote, spinaci)","qta":"circa 500 g","dove":"","note":""},{"ingrediente":"Uova","qta":"4","dove":"","note":""},{"ingrediente":"Latte","qta":"100 ml","dove":"","note":""},{"ingrediente":"Formaggio grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Formaggio filante a cubetti","qta":"100 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con stracchino e zucchine":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Zucchine","qta":"3","dove":"","note":""},{"ingrediente":"Stracchino","qta":"150 g","dove":"","note":""},{"ingrediente":"Scalogno piccolo","qta":"1","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo","dove":"","note":""}],"Pollo alla senape":[{"ingrediente":"Petto di pollo","qta":"450 g (3 fette)","dove":"","note":""},{"ingrediente":"Farina","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Senape di Digione","qta":"2 cucchiai","dove":"","note":""},{"ingrediente":"Senape in grani","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Miele","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Panna da cucina","qta":"100 ml","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo alla piastra":[{"ingrediente":"Petto di pollo","qta":"450 g (3 fette)","dove":"","note":""},{"ingrediente":"Limone","qta":"1 (succo e scorza)","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1 rametto","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"2 cucchiai","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Scaloppine ai funghi":[{"ingrediente":"Fettine di vitello","qta":"450 g","dove":"","note":""},{"ingrediente":"Funghi champignon","qta":"300 g","dove":"","note":""},{"ingrediente":"Farina","qta":"30 g","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Straccetti di manzo rucola e grana":[{"ingrediente":"Straccetti di manzo","qta":"450 g","dove":"","note":""},{"ingrediente":"Rucola","qta":"80 g","dove":"","note":""},{"ingrediente":"Grana o parmigiano a scaglie","qta":"60 g","dove":"","note":""},{"ingrediente":"Limone","qta":"succo di mezzo","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Salsiccia al forno con patate e peperoni":[{"ingrediente":"Salsiccia","qta":"500 g","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Peperoni","qta":"2","dove":"","note":""},{"ingrediente":"Aglio","qta":"1-2 spicchi","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"qualche rametto","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Cavolfiore gratinato":[{"ingrediente":"Cavolfiore","qta":"1 (circa 800 g-1 kg)","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Farina","qta":"30 g","dove":"","note":""},{"ingrediente":"Latte","qta":"400 ml","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"60 g","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"2 cucchiai","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pollo al limone e rosmarino":[{"ingrediente":"Sovracosce di pollo (o petto)","qta":"500–600 g","dove":"","note":""},{"ingrediente":"Limone","qta":"1","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1-2 rametti","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"facoltativo, per sfumare","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta alla carrettiera":[{"ingrediente":"Pasta","qta":"210 g","dove":"","note":""},{"ingrediente":"Pomodori maturi (o pomodorini)","qta":"400 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1-2 spicchi","dove":"","note":""},{"ingrediente":"Peperoncino fresco o secco","qta":"q.b.","dove":"","note":""},{"ingrediente":"Basilico","qta":"qualche foglia","dove":"","note":""},{"ingrediente":"Pecorino grattugiato (o ricotta salata)","qta":"50 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Spinaci al burro e parmigiano":[{"ingrediente":"Spinaci","qta":"500 g","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"40 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Fagiolini al pomodoro":[{"ingrediente":"Fagiolini","qta":"500 g","dove":"","note":""},{"ingrediente":"Pomodorini (o pelati)","qta":"300 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Basilico","qta":"qualche foglia","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Straccetti di manzo ai funghi":[{"ingrediente":"Fesa di manzo a straccetti","qta":"350 g","dove":"","note":""},{"ingrediente":"Funghi champignon","qta":"250 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"1 spicchio","dove":"","note":""},{"ingrediente":"Farina","qta":"q.b.","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Prezzemolo","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Tagliata di manzo con rucola, grana e pomodorini":[{"ingrediente":"Controfiletto o scamone in un unico pezzo","qta":"500 g","dove":"","note":""},{"ingrediente":"Rucola","qta":"1 mazzetto","dove":"","note":""},{"ingrediente":"Pomodorini","qta":"200 g","dove":"","note":""},{"ingrediente":"Grana o parmigiano a scaglie","qta":"50 g","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Aceto balsamico","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Sale grosso","qta":"q.b.","dove":"","note":""}],"Salsiccia e friarielli":[{"ingrediente":"Friarielli (cime di rapa napoletane)","qta":"500 g","dove":"","note":""},{"ingrediente":"Salsiccia di maiale","qta":"400 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Peperoncino fresco","qta":"facoltativo","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Zucchine alla scapece":[{"ingrediente":"Zucchine","qta":"600 g","dove":"","note":""},{"ingrediente":"Aglio","qta":"2 spicchi","dove":"","note":""},{"ingrediente":"Aceto di vino bianco","qta":"4 cucchiai","dove":"","note":""},{"ingrediente":"Menta fresca","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio per friggere","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Bietole gratinate":[{"ingrediente":"Bietole","qta":"800 g","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Farina","qta":"30 g","dove":"","note":""},{"ingrediente":"Latte","qta":"300 ml","dove":"","note":""},{"ingrediente":"Noce moscata","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pangrattato","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Piselli al prosciutto":[{"ingrediente":"Piselli (surgelati o già lessati)","qta":"400 g","dove":"","note":""},{"ingrediente":"Prosciutto cotto","qta":"150 g","dove":"","note":""},{"ingrediente":"Cipolla","qta":"mezza","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con patate":[{"ingrediente":"Pasta mista (o corta)","qta":"250 g","dove":"","note":""},{"ingrediente":"Patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Guanciale o pancetta","qta":"80 g","dove":"","note":""},{"ingrediente":"Sedano","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Carota","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Cipolla","qta":"1 pezzo","dove":"","note":""},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio","dove":"","note":""},{"ingrediente":"Crosta di parmigiano","qta":"facoltativa","dove":"","note":""},{"ingrediente":"Provola a cubetti","qta":"facoltativa","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}],"Pasta con ricotta e pomodoro":[{"ingrediente":"Pasta corta","qta":"220 g","dove":"","note":""},{"ingrediente":"Ricotta","qta":"250 g","dove":"","note":""},{"ingrediente":"Passata di pomodoro","qta":"300 g","dove":"","note":""},{"ingrediente":"Scalogno (o cipolla)","qta":"mezzo","dove":"","note":""},{"ingrediente":"Basilico","qta":"q.b.","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"q.b.","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""}],"Risotto salsiccia e rosmarino":[{"ingrediente":"Riso Carnaroli","qta":"240 g","dove":"","note":""},{"ingrediente":"Salsiccia","qta":"200 g","dove":"","note":""},{"ingrediente":"Rosmarino","qta":"1 rametto","dove":"","note":""},{"ingrediente":"Cipolla","qta":"mezza","dove":"","note":""},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere","dove":"","note":""},{"ingrediente":"Burro","qta":"30 g","dove":"","note":""},{"ingrediente":"Parmigiano grattugiato","qta":"30 g","dove":"","note":""},{"ingrediente":"Brodo vegetale","qta":"1 litro circa","dove":"","note":""},{"ingrediente":"Olio EVO","qta":"q.b.","dove":"","note":""}],"Gnocchi gorgonzola e noci":[{"ingrediente":"Gnocchi di patate","qta":"500 g","dove":"","note":""},{"ingrediente":"Gorgonzola","qta":"200 g","dove":"","note":""},{"ingrediente":"Latte","qta":"100 ml","dove":"","note":""},{"ingrediente":"Noci sgusciate","qta":"50 g","dove":"","note":""},{"ingrediente":"Sale","qta":"q.b.","dove":"","note":""},{"ingrediente":"Pepe","qta":"q.b.","dove":"","note":""}]},"generalShopping":[{"ingrediente":"Insalata","qta":"2 acquisti/cespi","dove":"Rossetto","note":"Ste la vuole spesso"}],"recipeDetails":{"Pasta alla Norma":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Melanzana","qta":"1 (circa 350–400 g)"},{"ingrediente":"Passata di pomodoro","qta":"350 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Ricotta salata","qta":"60–70 g"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Olio per friggere","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia la melanzana a cubetti o fettine.","Friggila fino a doratura e scolala bene.","Fai insaporire poco olio EVO con l'aglio.","Aggiungi la passata, basilico e sale.","Cuoci il sugo per circa 15–20 minuti.","Cuoci la pasta al dente.","Manteca la pasta con il sugo e circa metà delle melanzane.","Completa con le melanzane rimaste, basilico e ricotta salata."],"avanzi":"Perfetta per il pranzo.","freezer":"Meglio congelare solo il sugo.","ricordare":""},"Amatriciana":{"porzioni":"3 porzioni","tempo":"30 minuti","ingredienti":[{"ingrediente":"Spaghetti o bucatini","qta":"210 g"},{"ingrediente":"Guanciale","qta":"100 g"},{"ingrediente":"Pomodori pelati o passata rustica","qta":"300 g"},{"ingrediente":"Pecorino romano","qta":"55–60 g"},{"ingrediente":"Peperoncino","qta":"facoltativo"}],"procedimento":["Taglia il guanciale.","Mettilo in padella fredda e fallo rosolare lentamente.","Quando è croccante, toglilo temporaneamente.","Nel grasso rimasto cuoci il pomodoro per circa 10–15 minuti.","Cuoci la pasta.","Unisci pasta, sugo e guanciale.","Completa con pecorino e, se volete, peperoncino."],"avanzi":"Sì.","freezer":"","ricordare":""},"Carbonara":{"porzioni":"3 porzioni","tempo":"25 minuti","ingredienti":[{"ingrediente":"Spaghetti","qta":"210 g"},{"ingrediente":"Guanciale","qta":"100 g"},{"ingrediente":"Tuorli","qta":"3"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Pecorino romano","qta":"70 g"},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Rosola il guanciale lentamente finché è croccante.","Mescola in una ciotola tuorli, uovo, pecorino e pepe.","Cuoci la pasta e conserva acqua di cottura.","Scola e trasferisci la pasta nella padella con il guanciale.","Spegni il fuoco.","Aggiungi il composto di uova.","Manteca energicamente.","Aggiungi poca acqua di cottura finché diventa cremosa."],"avanzi":"Il pranzo del giorno dopo è possibile, ma rende meglio appena fatta — da tenere tra le ricette meno frequenti se destinata all'ufficio.","freezer":"No.","ricordare":""},"Pasta e ceci":{"porzioni":"3 porzioni","tempo":"45–60 minuti, dopo la preparazione dei ceci","ingredienti":[{"ingrediente":"Ceci secchi","qta":"150 g"},{"ingrediente":"Pasta piccola","qta":"180–210 g"},{"ingrediente":"Passata di pomodoro","qta":"200 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Rosmarino","qta":"1 rametto"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Acqua o brodo","qta":"q.b."}],"procedimento":["Metti i ceci in ammollo la sera prima.","Cuocili finché morbidi.","Fai insaporire aglio e rosmarino con poco olio.","Aggiungi la passata.","Unisci i ceci e acqua o brodo.","Frulla grossolanamente circa un terzo dei ceci.","Porta a bollore.","Cuoci la pasta direttamente nella zuppa, aggiungendo liquido quando serve.","Regola sale e pepe."],"avanzi":"","freezer":"Valuta doppia dose della base ceci: mangiate la pasta e ceci fresca e congelate una o due porzioni di base.","ricordare":"La sera prima: ceci in ammollo."},"Pasta con crema di zucchine e parmigiano":{"porzioni":"3 porzioni","tempo":"30 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Zucchine","qta":"3"},{"ingrediente":"Scalogno piccolo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"55–60 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Basilico o menta","qta":"facoltativi"}],"procedimento":["Taglia zucchine e scalogno.","Cuocili in padella con olio e un pizzico di sale.","Quando sono morbidi, tieni da parte qualche pezzo di zucchina.","Frulla il resto con parmigiano e poca acqua di cottura.","Cuoci la pasta.","Manteca con la crema.","Completa con le zucchine tenute da parte e pepe."],"avanzi":"Perfetta.","freezer":"Ottima la crema senza pasta.","ricordare":""},"Pasta con zucchine e speck":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Zucchine","qta":"3"},{"ingrediente":"Speck","qta":"90–110 g"},{"ingrediente":"Scalogno piccolo","qta":"1"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo"}],"procedimento":["Taglia le zucchine.","Falle cuocere con lo scalogno e poco olio.","Aggiungi lo speck verso fine cottura e fallo diventare croccante.","Cuoci la pasta.","Unisci tutto con poca acqua di cottura.","Completa con pepe."],"avanzi":"Sì.","freezer":"","ricordare":""},"Pasta con peperoni e salsiccia":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Peperoni","qta":"1 grande + 1 piccolo (o 2 piccoli)"},{"ingrediente":"Salsiccia","qta":"200–220 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Vino bianco","qta":"circa 50 ml"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Pulisci e taglia i peperoni.","Togli il budello alla salsiccia e spezzettala.","Rosola la salsiccia con poco olio, aglio e rosmarino.","Sfuma con il vino.","Toglila temporaneamente dalla padella.","Cuoci i peperoni nello stesso fondo, con coperchio e poca acqua se necessario.","Frulla circa metà dei peperoni.","Rimetti insieme crema, peperoni a pezzi e salsiccia.","Cuoci la pasta.","Manteca tutto con poca acqua di cottura."],"avanzi":"Ottima.","freezer":"Sì, congelando il condimento senza pasta.","ricordare":""},"Bistecca":{"porzioni":"3 porzioni","tempo":"15–20 minuti","ingredienti":[{"ingrediente":"Bistecche di manzo","qta":"3 (circa 200 g l'una)"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Togli la carne dal frigo 20–30 minuti prima di cuocerla.","Scalda bene una padella o una griglia, meglio se in ghisa.","Ungi leggermente il fondo con un filo d'olio.","Cuoci la bistecca 2–4 minuti per lato, girandola con pinze e non con la forchetta per non farle perdere i succhi.","Sala solo a fine cottura, quando è già girata dall'altro lato.","Lasciala riposare qualche minuto fuori dalla padella prima di servire."],"avanzi":"Meglio fresca, la carne alla griglia perde qualità se riscaldata.","freezer":"Non adatta, è già cotta e va consumata fresca.","ricordare":"","link":"https://www.agrodolce.it/ricette/bistecca-ai-ferri"},"Risotto ai quattro formaggi":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli o Vialone Nano","qta":"240 g"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Scalogno (o mezza cipolla)","qta":"1"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Taleggio","qta":"100 g"},{"ingrediente":"Gorgonzola","qta":"60 g"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Provolone o brie","qta":"40 g"},{"ingrediente":"Vino bianco","qta":"facoltativo, per sfumare"},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Prepara il brodo vegetale e tienilo caldo sul fuoco.","Trita finemente lo scalogno e falla appassire nel burro a fuoco basso.","Versa il riso e tostalo per 1–2 minuti mescolando.","Sfuma con il vino bianco, se lo usi, e lascia evaporare.","Aggiungi il brodo un mestolo alla volta, mescolando e aspettando che venga assorbito prima di aggiungerne altro, per circa 15–18 minuti.","A cottura quasi ultimata, spegni il fuoco.","Manteca con i formaggi tagliati a pezzetti, mescolando finché non si sciolgono bene.","Servi subito con una macinata di pepe."],"avanzi":"Meglio fresco, il risotto perde cremosità se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://ricette.giallozafferano.it/Risotto-ai-4-formaggi.html"},"Pollo fritto":{"porzioni":"3 porzioni","tempo":"30–40 minuti + marinatura","ingredienti":[{"ingrediente":"Petto di pollo o cosce disossate","qta":"500 g"},{"ingrediente":"Latticello (o yogurt bianco diluito con poco latte)","qta":"200 ml"},{"ingrediente":"Farina","qta":"150 g"},{"ingrediente":"Paprika dolce","qta":"1 cucchiaino"},{"ingrediente":"Aglio in polvere","qta":"1 cucchiaino"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Olio di semi per friggere","qta":"abbondante"}],"procedimento":["Taglia il pollo a pezzi non troppo grandi.","Immergilo nel latticello e lascialo marinare in frigo per almeno 30–60 minuti (anche 1 ora).","Prepara la farina mescolata con paprika, aglio in polvere, sale e pepe.","Scalda abbondante olio a 170–180°C.","Scola il pollo dal latticello e passalo nella farina speziata, premendo bene perché si attacchi.","Friggi pochi pezzi alla volta per 8–10 minuti, girandoli a metà cottura, finché dorati e cotti dentro.","Scola su carta assorbente e sala subito."],"avanzi":"Meglio fresco, perde croccantezza se riscaldato.","freezer":"Non adatto.","ricordare":"Marinare il pollo nel latticello almeno 30–60 minuti prima di cuocerlo.","link":"https://www.cucchiaio.it/ricetta/pollo-fritto/"},"Salmone con zucchine":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Zucchine","qta":"3"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"facoltativo"}],"procedimento":["Taglia le zucchine a rondelle sottili o a julienne.","Scalda un filo d'olio con l'aglio in padella, aggiungi le zucchine e cuocile 6–8 minuti, salando a fine cottura.","Mettile da parte tenendole in caldo.","Nella stessa padella scalda un altro filo d'olio e cuoci i filetti di salmone 3–4 minuti per lato.","Sala il salmone solo a fine cottura.","Servi il salmone con le zucchine, guarnendo con prezzemolo se lo usi."],"avanzi":"Buona anche il giorno dopo.","freezer":"Non adatto, il pesce già cotto perde consistenza.","ricordare":"","link":"https://www.agrodolce.it/ricette/salmone-e-zucchine-in-padella"},"Peperonata":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Peperoni misti (rossi e gialli)","qta":"3"},{"ingrediente":"Cipolla","qta":"1"},{"ingrediente":"Pomodori pelati o passata","qta":"300 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Zucchero","qta":"facoltativo, un cucchiaino per bilanciare l'acidità"}],"procedimento":["Taglia i peperoni a strisce e la cipolla a fettine sottili.","Soffriggi la cipolla in olio a fuoco basso finché appassita.","Aggiungi i peperoni, mescola e cuoci coperto a fuoco medio-basso per 15–20 minuti, mescolando ogni tanto.","Unisci i pomodori (e lo zucchero, se lo usi), regola di sale e pepe.","Continua la cottura scoperta per altri 15–20 minuti finché il sugo si è ristretto e i peperoni sono morbidi.","Completa con basilico fresco spezzettato."],"avanzi":"Ottima anche il giorno dopo, buona pure fredda.","freezer":"Si può congelare.","ricordare":"","link":"https://ricette.giallozafferano.it/Peperonata.html"},"Uova al tegamino con pomodoro":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Uova","qta":"6"},{"ingrediente":"Passata di pomodoro (o pomodorini)","qta":"400 ml"},{"ingrediente":"Aglio (o mezza cipolla)","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Zucchero","qta":"facoltativo, un pizzico"}],"procedimento":["Scalda l'olio con l'aglio (o la cipolla tritata) in una padella larga.","Aggiungi la passata, sala, unisci lo zucchero se lo usi.","Cuoci 15–20 minuti a fuoco basso finché il sugo si restringe.","Fai dei piccoli incavi nel sugo e rompici le uova una alla volta.","Copri e cuoci 4–6 minuti finché l'albume è rappreso e il tuorlo ancora morbido.","Completa con basilico fresco e servi con pane tostato."],"avanzi":"Meglio fresche, l'uovo cotto non si riscalda bene.","freezer":"Non adatto.","ricordare":"","link":"https://www.agrodolce.it/ricette/uova-al-tegame"},"Prosciutto e melone":{"porzioni":"3 porzioni","tempo":"10–15 minuti","ingredienti":[{"ingrediente":"Melone maturo","qta":"1"},{"ingrediente":"Prosciutto crudo a fette","qta":"150–180 g"},{"ingrediente":"Pepe","qta":"facoltativo"}],"procedimento":["Taglia il melone a metà ed elimina i semi con un cucchiaio.","Taglialo a fette e rimuovi la buccia da ciascuna.","Avvolgi ogni fetta con una fettina di prosciutto crudo.","Disponi su un piatto da portata.","Completa con una macinata di pepe nero, se gradito, e servi ben fresco."],"avanzi":"Meglio fresco, il melone perde consistenza se conservato già tagliato.","freezer":"Non adatta, è un piatto senza cottura.","ricordare":"","link":"https://www.cookist.it/prosciutto-e-melone-ricetta/"},"Spiedini con patate":{"porzioni":"3 porzioni","tempo":"55–65 minuti","ingredienti":[{"ingrediente":"Petto di pollo o lonza di maiale a cubetti","qta":"400 g"},{"ingrediente":"Salsiccia","qta":"200 g"},{"ingrediente":"Pancetta a cubetti","qta":"facoltativa, 100 g"},{"ingrediente":"Spiedini già pronti (dal freezer)","qta":"facoltativi, in alternativa alla carne cruda se già assemblati in anticipo"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Peperone","qta":"1"},{"ingrediente":"Rosmarino","qta":"qualche rametto"},{"ingrediente":"Salvia","qta":"qualche foglia"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia la carne (pollo, lonza, salsiccia) a cubetti o pezzi regolari.","Taglia il peperone a pezzi quadrati di circa 3 cm.","Componi gli spiedini alternando i pezzi di carne e di peperone sugli stecchini.","Sbuccia e taglia le patate a tocchetti, sbollentale in acqua per 8–10 minuti.","Disponi le patate in una teglia con olio, aglio, rosmarino e salvia.","Adagia sopra gli spiedini.","Cuoci in forno statico a 200°C per 30–40 minuti, girando a metà cottura, finché la carne è dorata e le patate morbide."],"avanzi":"Buona anche il giorno dopo.","freezer":"Non adatta, è un piatto misto già cotto.","ricordare":"","link":"https://blog.giallozafferano.it/cucinoperpassione/ricetta-spiedini-al-forno-con-patate/"},"Pasta tonno e limone":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Pasta (linguine o spaghetti)","qta":"210 g"},{"ingrediente":"Tonno in scatola","qta":"circa 160 g"},{"ingrediente":"Limone (scorza e succo)","qta":"1"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Peperoncino","qta":"facoltativo"},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Metti a bollire l'acqua per la pasta e falla cuocere al dente.","Nel frattempo scalda un filo d'olio con l'aglio in padella, con il peperoncino se lo usi.","Aggiungi il tonno sgocciolato e sfaldalo con una forchetta, scaldandolo un paio di minuti.","Unisci scorza e succo di limone.","Scola la pasta e mantecala in padella con il condimento, allungando con un po' di acqua di cottura.","Completa con prezzemolo tritato e servi subito."],"avanzi":"Buona, anche se rende meglio consumata fresca.","freezer":"Non adatta.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/pasta-tonno-limone/"},"Pasta fredda":{"porzioni":"3 porzioni","tempo":"25–30 minuti + raffreddamento","ingredienti":[{"ingrediente":"Pasta corta (fusilli o penne)","qta":"240 g"},{"ingrediente":"Tonno in scatola","qta":"160 g"},{"ingrediente":"Pomodorini","qta":"200 g"},{"ingrediente":"Mozzarella o bocconcini","qta":"150 g"},{"ingrediente":"Olive","qta":"50 g"},{"ingrediente":"Mais","qta":"facoltativo, 80 g"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Cuoci la pasta al dente, scolala e passala subito sotto l'acqua fredda per bloccare la cottura.","Scolala bene e conditela con un filo d'olio per non farla attaccare.","Taglia i pomodorini a metà e la mozzarella a cubetti.","In una ciotola capiente unisci la pasta fredda con tonno, pomodorini, mozzarella, olive e mais.","Condisci con olio, sale, pepe e basilico spezzettato.","Mescola bene e lascia riposare in frigorifero almeno 30 minuti prima di servire, così i sapori si amalgamano."],"avanzi":"Ottima anche il giorno dopo, si conserva bene in frigo.","freezer":"Non adatta.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/pasta-fredda-estiva/"},"Melanzane alla pizzaiola":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Melanzane","qta":"2 grandi"},{"ingrediente":"Passata di pomodoro","qta":"300 g"},{"ingrediente":"Mozzarella","qta":"150 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Origano","qta":"q.b."},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia le melanzane a fette di circa mezzo centimetro.","Grigliale su una piastra ben calda 2–3 minuti per lato, finché morbide.","Nel frattempo scalda l'olio con l'aglio in padella, aggiungi la passata, sala e cuoci 10–15 minuti.","Scola bene la mozzarella e tagliala a fettine o cubetti.","Adagia le melanzane grigliate nella padella con il sugo.","Distribuisci la mozzarella sopra, copri con un coperchio e cuoci a fuoco basso finché filante.","Completa con origano e basilico fresco prima di servire."],"avanzi":"Si conserva in frigo fino a 2 giorni, buona anche riscaldata.","freezer":"Non indicata, meglio consumarla fresca.","ricordare":"","link":"https://www.cookist.it/melanzane-alla-pizzaiola-ricetta/"},"Risotto zucchine e speck":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Zucchine","qta":"2"},{"ingrediente":"Speck","qta":"100 g"},{"ingrediente":"Cipolla o scalogno","qta":"1"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Burro","qta":"20 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava le zucchine e tagliale a pezzetti piccoli.","Trita la cipolla e falla rosolare in un filo d'olio.","Aggiungi lo speck e fallo rosolare un paio di minuti.","Unisci il riso e tostalo per 1–2 minuti.","Sfuma con il vino bianco, se lo usi, e lascia evaporare.","Aggiungi le zucchine, poi il brodo un mestolo alla volta, mescolando fino a cottura del riso (circa 16–18 minuti).","A fuoco spento manteca con burro e parmigiano, aggiusta di sale e pepe.","Servi con una macinata di pepe."],"avanzi":"Meglio fresco, il risotto perde cremosità se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.cookaround.com/ricetta/Risotto-zucchine-e-speck.html"},"Pasta al pesto":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Pasta (trofie o trenette)","qta":"240 g"},{"ingrediente":"Basilico","qta":"40 g"},{"ingrediente":"Pinoli","qta":"20 g"},{"ingrediente":"Parmigiano grattugiato","qta":"30 g"},{"ingrediente":"Pecorino grattugiato","qta":"20 g"},{"ingrediente":"Aglio","qta":"1/2 spicchio"},{"ingrediente":"Olio EVO","qta":"circa 80 ml"},{"ingrediente":"Sale grosso","qta":"q.b."}],"procedimento":["Lava e asciuga delicatamente le foglie di basilico, senza lasciarle a bagno.","Frulla (o pesta nel mortaio) l'aglio con un pizzico di sale grosso.","Aggiungi i pinoli e le foglie di basilico poco alla volta.","Unisci i formaggi e infine l'olio a filo, fino a ottenere una crema omogenea.","Cuoci la pasta in acqua bollente salata.","Scola la pasta tenendo da parte un po' di acqua di cottura.","Manteca la pasta con il pesto fuori dal fuoco, allungando con acqua di cottura se serve."],"avanzi":"Meglio fresca, il pesto tende a scurirsi.","freezer":"Il pesto (senza pasta) si può congelare in vasetti.","ricordare":"","link":"https://www.eataly.net/it_it/magazine/ricette/pasta-al-pesto"},"Pasta a cacio e pepe":{"porzioni":"3 porzioni","tempo":"15–20 minuti","ingredienti":[{"ingrediente":"Pasta (tonnarelli o spaghetti)","qta":"240 g"},{"ingrediente":"Pecorino romano grattugiato","qta":"150 g"},{"ingrediente":"Pepe","qta":"q.b., abbondante"}],"procedimento":["Pesta i grani di pepe nel mortaio (o macinali grossolanamente).","Tostali un minuto in una padella ampia e larga, poi spegni.","Cuoci la pasta in acqua bollente poco salata (il pecorino è già sapido).","Metti il pecorino in una ciotola con un mestolo di acqua di cottura, mescola fino a una crema pastosa senza grumi.","Circa 2 minuti prima che la pasta sia pronta, scola conservando l'acqua di cottura e trasferiscila nella padella col pepe.","Aggiungi un mestolo di acqua di cottura e manteca a fuoco basso.","Spegni il fuoco e unisci la crema di pecorino, mescolando energicamente fino a renderla vellutata."],"avanzi":"Meglio fresca, la crema di formaggio tende a rapprendersi se riscaldata.","freezer":"Non adatta.","ricordare":"","link":"https://www.cookist.it/spaghetti-cacio-e-pepe-ricetta/"},"Pasta e fagioli":{"porzioni":"3 porzioni","tempo":"35–40 minuti (con fagioli già cotti)","ingredienti":[{"ingrediente":"Fagioli borlotti o cannellini già cotti","qta":"400 g"},{"ingrediente":"Pasta corta (ditalini o mista)","qta":"150 g"},{"ingrediente":"Passata di pomodoro o concentrato","qta":"2 cucchiai di concentrato o 200 g passata"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Sedano","qta":"facoltativo, 1 gambo"},{"ingrediente":"Carota","qta":"facoltativa, 1 pezzo"},{"ingrediente":"Rosmarino o alloro","qta":"q.b."},{"ingrediente":"Brodo vegetale o acqua calda","qta":"circa 700 ml"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita cipolla (e sedano e carota se li usi) e falli soffriggere in un filo d'olio con il rosmarino.","Aggiungi i fagioli, tenendone da parte una parte da frullare a crema con un po' di brodo.","Unisci la crema di fagioli frullata e il concentrato o la passata.","Versa il brodo caldo, porta a bollore e aggiungi la pasta.","Cuoci fino a cottura della pasta, mescolando ogni tanto e aggiungendo brodo se si asciuga troppo.","Regola di sale e pepe, lascia riposare qualche minuto coperta prima di servire con un filo d'olio a crudo."],"avanzi":"Ottima anche il giorno dopo, spesso migliora di sapore.","freezer":"Si può congelare, meglio senza la pasta (aggiungerla fresca al momento di servire).","ricordare":"","link":"https://www.cookist.it/pasta-e-fagioli-ricetta/"},"Trancio di salmone al forno":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Tranci di salmone","qta":"3 (circa 180 g l'uno)"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Prepara un'emulsione con olio, succo di limone, prezzemolo tritato, sale e pepe.","Disponi i tranci di salmone in una teglia foderata con carta forno.","Spennella generosamente i tranci con l'emulsione.","Cuoci in forno preriscaldato a 190°C per 15–18 minuti, a seconda dello spessore.","Sforna e completa con altro prezzemolo fresco e una spruzzata di limone."],"avanzi":"Meglio fresco, il pesce cotto perde consistenza se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/salmone-al-forno/"},"Gnocchi alla sorrentina":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Gnocchi di patate","qta":"600 g"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Mozzarella","qta":"200 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Scola bene la mozzarella e tagliala a dadini, lasciandola sgocciolare.","Scalda l'olio con l'aglio in una padella, aggiungi la passata, sala e cuoci 15–20 minuti.","Cuoci gli gnocchi in acqua bollente salata finché vengono a galla.","Scolali e versali direttamente nella padella col sugo, mescolando delicatamente.","Trasferisci in una teglia da forno, distribuisci mozzarella e parmigiano.","Gratina in forno già caldo a 200°C per 5–10 minuti, finché la mozzarella è filante e dorata.","Guarnisci con basilico fresco e servi subito."],"avanzi":"Buona anche il giorno dopo, riscaldata in forno o padella.","freezer":"Non indicata, il formaggio filante non rende bene una volta scongelato.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/gnocchi-alla-sorrentina/"},"Zucchine gratinate al forno":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Zucchine","qta":"5–6"},{"ingrediente":"Pangrattato","qta":"80 g"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava le zucchine, elimina le estremità e affettale sottili (2–3 mm), meglio con una mandolina.","Frulla o trita finemente olio, prezzemolo e aglio per ottenere un olio aromatico.","Mescola pangrattato e parmigiano con l'olio aromatico, sale e pepe.","Disponi le fette di zucchine in una teglia foderata, condiscile con la panatura.","Cuoci in forno già caldo a 200°C per 15–20 minuti, finché dorate e croccanti in superficie."],"avanzi":"Si conservano un paio di giorni in frigo, buone anche a temperatura ambiente.","freezer":"Non indicata.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/zucchine-gratinate-al-forno/"},"Risotto alla milanese":{"porzioni":"3 porzioni","tempo":"35–40 minuti (con brodo già pronto)","ingredienti":[{"ingrediente":"Riso Carnaroli o Vialone Nano","qta":"240 g"},{"ingrediente":"Zafferano","qta":"1 bustina o una presa di pistilli"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Brodo di carne o vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Burro","qta":"50 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Scalda il brodo e tienilo caldo sul fuoco.","Stempera lo zafferano in un mestolo di brodo caldo e lascialo in infusione.","Trita la cipolla e falla appassire a fuoco basso in metà del burro.","Aggiungi il riso e tostalo 2-3 minuti.","Sfuma con il vino bianco, se lo usi, e lascia evaporare.","Aggiungi il brodo un mestolo alla volta, mescolando, per circa 16-18 minuti.","A metà cottura unisci il brodo con lo zafferano.","A fuoco spento manteca con il burro rimasto e il parmigiano, mescolando energicamente.","Lascia riposare un minuto coperto e servi."],"avanzi":"Meglio fresco, si consiglia di consumarlo appena pronto.","freezer":"Non adatto.","ricordare":"","link":"https://ricette.giallozafferano.it/Risotto-alla-milanese.html"},"Parmigiana di melanzane":{"porzioni":"4 porzioni","tempo":"1 ora e 30 minuti","ingredienti":[{"ingrediente":"Melanzane","qta":"3 grandi"},{"ingrediente":"Passata di pomodoro","qta":"500 g"},{"ingrediente":"Mozzarella","qta":"300 g"},{"ingrediente":"Parmigiano grattugiato","qta":"80 g"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Olio per friggere","qta":"abbondante"},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le melanzane a fette di mezzo centimetro nel senso della lunghezza.","Disponile a strati in uno scolapasta, salandole tra uno strato e l'altro, e lasciale spurgare almeno 1 ora sotto un peso.","Prepara il sugo: soffriggi la cipolla tritata, aggiungi la passata, sala e cuoci 20 minuti con basilico.","Sciacqua le melanzane, asciugale e friggile in olio bollente fino a doratura, poi scolale su carta assorbente.","Taglia la mozzarella a fette e falla sgocciolare bene.","In una teglia versa un po' di sugo sul fondo, poi uno strato di melanzane, sugo, mozzarella, parmigiano e basilico.","Ripeti gli strati fino a esaurire gli ingredienti, terminando con sugo e parmigiano.","Cuoci in forno statico a 200°C per 25–30 minuti.","Lascia riposare qualche minuto prima di tagliare e servire."],"avanzi":"Ottima anche il giorno dopo, anzi migliora riposando.","freezer":"Si può congelare già porzionata.","ricordare":"Far spurgare le melanzane sotto sale almeno 1 ora prima di cucinare.","link":"https://www.cucchiaio.it/ricetta/ricetta-parmigiana-melanzane/"},"Pollo alla cacciatora":{"porzioni":"3 porzioni","tempo":"50–60 minuti","ingredienti":[{"ingrediente":"Pollo a pezzi (cosce o petto)","qta":"700 g"},{"ingrediente":"Cipolla","qta":"1"},{"ingrediente":"Sedano","qta":"1 gambo"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Pomodori pelati","qta":"400 g"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olive nere","qta":"facoltative, 80 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita cipolla, sedano e carota.","Fai rosolare il trito in olio in una padella ampia.","Aggiungi i pezzi di pollo e rosolali finché dorati su tutti i lati.","Sfuma con il vino bianco e lascia evaporare.","Aggiungi i pomodori pelati sminuzzati, il rosmarino e un po' d'acqua per allungare.","Copri e cuoci a fuoco basso per circa 40 minuti, girando il pollo ogni tanto.","Se usi le olive, uniscile 5 minuti prima della fine.","Regola di sale, lascia riposare qualche minuto e servi con prezzemolo tritato."],"avanzi":"Ottimo il giorno dopo, il sapore migliora riposando.","freezer":"Si può congelare.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/pollo-alla-cacciatora/"},"Cotoletta alla milanese":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Fettine di vitello (o lombata)","qta":"3"},{"ingrediente":"Uova","qta":"2"},{"ingrediente":"Pangrattato","qta":"150 g"},{"ingrediente":"Farina","qta":"facoltativa, q.b."},{"ingrediente":"Burro","qta":"80 g"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Limone","qta":"per servire"}],"procedimento":["Elimina il grasso in eccesso dalla carne e battila leggermente per uniformare lo spessore.","Sbatti le uova in un piatto con un pizzico di sale.","Passa le fettine (nella farina se la usi), poi nell'uovo sbattuto e infine nel pangrattato, premendo bene.","Sciogli il burro in una padella ampia finché ben caldo.","Friggi le cotolette pochi minuti per lato, finché dorate.","Scolale su carta assorbente, sala leggermente e servi calde con spicchi di limone."],"avanzi":"Meglio fresca, va cotta e mangiata subito.","freezer":"Non adatta, ma si può congelare cruda già impanata.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/cotoletta-alla-milanese/"},"Orata/branzino al forno con patate":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Orata o branzino (anche filetti)","qta":"2 (circa 400 g l'una)"},{"ingrediente":"Patate","qta":"600 g"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava e taglia le patate a fette sottili, mettile in acqua fredda 10 minuti per togliere l'amido in eccesso.","Scolale, condiscile con olio, sale, pepe e disponile su una teglia foderata.","Inforna le patate da sole a 200°C per 15 minuti.","Pulisci il pesce, condiscilo dentro e fuori con sale, pepe, aglio e rosmarino.","Adagia il pesce sopra le patate, aggiungi fette di limone e un filo d'olio.","Inforna insieme per altri 20–25 minuti, finché il pesce è cotto e le patate dorate."],"avanzi":"Meglio fresco, il pesce cotto perde consistenza se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/orata-forno-patate/"},"Frittata di zucchine e parmigiano":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Uova","qta":"6"},{"ingrediente":"Zucchine","qta":"2"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Cipolla","qta":"facoltativa, 1/2"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia le zucchine a rondelle sottili.","Se la usi, soffriggi la cipolla in olio, poi aggiungi le zucchine e cuoci 8–10 minuti finché morbide.","Sbatti le uova con parmigiano, prezzemolo, sale e pepe.","Unisci le zucchine intiepidite al composto di uova.","Versa tutto in padella con un filo d'olio, copri e cuoci a fuoco basso 8–10 minuti.","Gira la frittata con l'aiuto di un piatto o un coperchio e cuoci ancora 3–4 minuti dall'altro lato."],"avanzi":"Buona anche fredda il giorno dopo, ottima per il pranzo.","freezer":"Non indicata.","ricordare":"","link":"https://www.ricettealvolo.it/frittata-di-zucchine-ricetta-facile/"},"Ceci in umido al pomodoro e rosmarino + pane":{"porzioni":"3 porzioni","tempo":"30–35 minuti (con ceci già cotti)","ingredienti":[{"ingrediente":"Ceci già cotti","qta":"500 g"},{"ingrediente":"Passata di pomodoro","qta":"300 g"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Rosmarino","qta":"1 rametto"},{"ingrediente":"Alloro","qta":"1 foglia, facoltativo"},{"ingrediente":"Brodo vegetale o acqua","qta":"q.b."},{"ingrediente":"Pane casereccio","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita cipolla e aglio, falli soffriggere in olio con rosmarino e alloro.","Aggiungi la passata di pomodoro, sala e cuoci 5 minuti.","Unisci i ceci scolati e un po' di brodo o acqua caldi.","Copri e cuoci a fuoco basso 15–20 minuti, mescolando ogni tanto.","Se vuoi una consistenza più cremosa, schiaccia una parte dei ceci con una forchetta.","Regola di sale e pepe, servi ben caldo con fette di pane tostato."],"avanzi":"Ottimi anche il giorno dopo, il sapore migliora riposando.","freezer":"Si può congelare.","ricordare":"Se usi i ceci secchi, metterli in ammollo la sera prima.","link":"https://blog.giallozafferano.it/allacciateilgrembiule/ricetta-ceci-in-umido/"},"Caponata siciliana":{"porzioni":"4 porzioni","tempo":"50–60 minuti","ingredienti":[{"ingrediente":"Melanzane","qta":"2 grandi"},{"ingrediente":"Sedano","qta":"2 coste"},{"ingrediente":"Cipolla","qta":"1"},{"ingrediente":"Pomodori maturi o pelati","qta":"300 g"},{"ingrediente":"Olive verdi","qta":"80 g"},{"ingrediente":"Capperi","qta":"30 g"},{"ingrediente":"Aceto di vino bianco","qta":"2 cucchiai"},{"ingrediente":"Zucchero","qta":"1 cucchiaio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio per friggere","qta":"abbondante"},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le melanzane a cubetti, cospargile di sale e lasciale spurgare 30 minuti in uno scolapasta.","Sciacquale, asciugale e friggile in olio bollente fino a doratura, poi scola su carta assorbente.","Taglia il sedano a listarelle e sbollentalo 5 minuti.","Affetta la cipolla e falla appassire in un tegame con un filo d'olio.","Aggiungi i pomodori a pezzi e cuoci 10 minuti.","Unisci melanzane, sedano, olive e capperi.","Aggiungi aceto e zucchero, lascia sfumare qualche minuto per l'agrodolce.","Regola di sale, spegni e lascia raffreddare almeno 1-2 ore prima di servire con basilico fresco."],"avanzi":"Migliora nei giorni successivi, si conserva in frigo fino a una settimana.","freezer":"Si può congelare.","ricordare":"Meglio prepararla in anticipo: va servita fredda o a temperatura ambiente.","link":"https://www.tavolartegusto.it/ricetta/caponata-siciliana/"},"Saltimbocca alla romana":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Fettine di vitello","qta":"6 piccole"},{"ingrediente":"Prosciutto crudo a fette","qta":"6 fette"},{"ingrediente":"Salvia","qta":"6-12 foglie"},{"ingrediente":"Farina","qta":"q.b."},{"ingrediente":"Burro","qta":"40 g"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Batti leggermente le fettine di vitello con un batticarne.","Adagia su ciascuna una fetta di prosciutto crudo e una foglia di salvia, fissando con uno stecchino.","Infarina leggermente solo il lato con il prosciutto.","Sciogli il burro in una padella ampia.","Cuoci le fettine dal lato infarinato per circa 2 minuti, poi gira e cuoci ancora 1-2 minuti.","Sfuma con il vino bianco, lascia restringere il fondo di cottura un minuto.","Servi subito, irrorando con il fondo di cottura."],"avanzi":"Meglio fresco, la carne sottile perde consistenza se riscaldata.","freezer":"Non adatto.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/saltimbocca-alla-romana-ricetta-originale/"},"Torta salata ricotta e spinaci":{"porzioni":"4 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Pasta sfoglia","qta":"1 rotolo"},{"ingrediente":"Ricotta","qta":"250 g"},{"ingrediente":"Spinaci","qta":"300 g"},{"ingrediente":"Uova","qta":"2"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Noce moscata","qta":"facoltativa"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lessa o scongela gli spinaci, strizzali bene ed eventualmente tritali.","In una ciotola mescola ricotta, spinaci, uova, parmigiano, sale e pepe (e noce moscata, se la usi).","Foderare una tortiera con la pasta sfoglia, bucherellando il fondo con una forchetta.","Versa il ripieno e livella la superficie.","Ripiega i bordi della sfoglia verso il centro.","Cuoci in forno preriscaldato a 180°C per 35–40 minuti, finché dorata.","Lascia intiepidire qualche minuto prima di servire."],"avanzi":"Si conserva in frigo 2-3 giorni, buona anche fredda.","freezer":"Si può congelare, sia cruda che già cotta.","ricordare":"","link":"https://www.cookist.it/la-ricetta-torta-salata-ricotta-e-spinaci/"},"Zuppa di ceci e zucca":{"porzioni":"3 porzioni","tempo":"35–40 minuti (con ceci già cotti)","ingredienti":[{"ingrediente":"Zucca","qta":"500 g di polpa"},{"ingrediente":"Ceci già cotti","qta":"400 g"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Brodo vegetale","qta":"circa 500 ml"},{"ingrediente":"Rosmarino","qta":"1 rametto"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Pane per crostini","qta":"facoltativo"}],"procedimento":["Elimina la scorza della zucca e taglia la polpa a cubetti.","Trita la cipolla e falla soffriggere in olio con il rosmarino.","Aggiungi la zucca e rosolala qualche minuto.","Copri con il brodo caldo e cuoci finché la zucca è morbida, circa 15–20 minuti.","Aggiungi i ceci scolati e cuoci altri 10 minuti.","Se preferisci una consistenza più cremosa, frulla parzialmente con un frullatore a immersione.","Regola di sale e pepe, servi ben calda con un filo d'olio e crostini di pane, se li usi."],"avanzi":"Ottima anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"Se usi ceci secchi, metterli in ammollo la sera prima.","link":"https://www.cookist.it/zuppa-ceci-e-zucca-ricetta/"},"Pasta e lenticchie":{"porzioni":"3 porzioni","tempo":"35–40 minuti (con lenticchie già cotte)","ingredienti":[{"ingrediente":"Lenticchie già cotte","qta":"400 g"},{"ingrediente":"Pasta corta (ditalini o tubetti)","qta":"150 g"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Sedano","qta":"1 gambo"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Concentrato o passata di pomodoro","qta":"2 cucchiai o 200 g"},{"ingrediente":"Alloro","qta":"1 foglia"},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 700 ml"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita cipolla, sedano e carota, falli soffriggere in olio.","Aggiungi il concentrato o la passata e fai insaporire un paio di minuti.","Unisci le lenticchie scolate e l'alloro.","Versa il brodo caldo, porta a bollore.","Aggiungi la pasta e cuoci mescolando spesso, aggiungendo liquido se si asciuga troppo.","Regola di sale e pepe, lascia riposare qualche minuto coperta e servi con un filo d'olio a crudo."],"avanzi":"Ottima anche il giorno dopo, il sapore migliora riposando.","freezer":"Si può congelare, meglio senza pasta.","ricordare":"Se usi lenticchie secche, non serve ammollo: bastano 20-30 minuti di cottura.","link":"https://www.tavolartegusto.it/ricetta/pasta-e-lenticchie/"},"Fagioli all'uccelletto + pane/salsiccia":{"porzioni":"3 porzioni","tempo":"25–30 minuti (con fagioli già cotti)","ingredienti":[{"ingrediente":"Fagioli cannellini già cotti","qta":"500 g"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Salvia","qta":"qualche foglia"},{"ingrediente":"Rosmarino","qta":"facoltativo, un rametto"},{"ingrediente":"Passata di pomodoro","qta":"200 g"},{"ingrediente":"Salsiccia","qta":"facoltativa, 200 g"},{"ingrediente":"Pane casereccio","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Fai imbiondire l'aglio in olio con salvia (e rosmarino, se lo usi).","Se usi la salsiccia, sgranala e falla rosolare a parte, poi uniscila.","Aggiungi i fagioli scolati e fai insaporire qualche minuto.","Unisci la passata, sala e pepa.","Cuoci coperto a fuoco basso 10-15 minuti, mescolando ogni tanto.","Servi caldo con fette di pane casereccio tostato."],"avanzi":"Buoni anche il giorno dopo.","freezer":"Si può congelare (senza salsiccia rende meglio).","ricordare":"","link":"https://www.cookist.it/fagioli-alluccelletto-la-ricetta/"},"Uova in purgatorio":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Uova","qta":"6"},{"ingrediente":"Passata di pomodoro","qta":"300 ml"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Pane per servire","qta":"q.b."}],"procedimento":["Scalda l'olio con l'aglio in padella, aggiungi basilico.","Versa la passata, sala e cuoci a fuoco basso 7-8 minuti.","Rompi le uova una alla volta direttamente nel sugo, distanziandole.","Sala e pepa leggermente le uova.","Copri e cuoci 3-4 minuti finché l'albume è rappreso e il tuorlo ancora morbido.","Completa con basilico fresco e servi con pane tostato."],"avanzi":"Meglio fresche, il tuorlo continua a cuocere se conservate.","freezer":"Non adatta.","ricordare":"","link":"https://www.dissapore.com/ricette/uova-in-purgatorio/"},"Frittata di patate":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Uova","qta":"6"},{"ingrediente":"Patate","qta":"3 medie"},{"ingrediente":"Cipolla","qta":"facoltativa, 1/2"},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo, 40 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbuccia le patate e tagliale a cubetti piccoli.","Rosolale in padella con olio (e cipolla, se la usi) per circa 15 minuti, finché morbide e dorate.","Sbatti le uova con sale, pepe e parmigiano, se lo usi.","Unisci le patate tiepide alle uova sbattute.","Versa il composto in padella con un filo d'olio, copri e cuoci a fuoco basso 8-10 minuti.","Gira la frittata con l'aiuto di un piatto e cuoci ancora 4-5 minuti dall'altro lato."],"avanzi":"Buona anche fredda il giorno dopo.","freezer":"Si può congelare già porzionata.","ricordare":"","link":"https://www.soniaperonaci.it/frittata-di-patate/"},"Filetti di merluzzo gratinati":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Pangrattato","qta":"80 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Limone (scorza e succo)","qta":"1"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Disponi i filetti in una teglia foderata con carta forno.","Condiscili con sale, pepe e un filo d'olio.","Mescola pangrattato, prezzemolo tritato, aglio grattugiato, scorza e succo di limone con un filo d'olio fino a un composto sabbioso.","Ricopri i filetti con la panatura, premendo leggermente.","Cuoci in forno già caldo a 200°C per 15-18 minuti, finché dorati.","Servi con un ulteriore spicchio di limone."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.ilclubdellericette.it/ricetta/merluzzo-gratinato-al-forno"},"Salmone gratinato con pangrattato, prezzemolo e limone":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Pangrattato","qta":"80 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Limone (scorza e succo)","qta":"1"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Disponi i filetti di salmone in una teglia foderata con carta forno.","Condiscili con sale, pepe e un filo d'olio.","Mescola pangrattato, prezzemolo tritato, aglio, scorza e succo di limone con un filo d'olio.","Distribuisci la panatura sui filetti, premendo leggermente.","Cuoci in forno già caldo a 190°C per 15-18 minuti, finché dorati in superficie.","Servi caldo con un ulteriore spicchio di limone."],"avanzi":"Meglio fresco, il pesce cotto perde consistenza se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/merluzzo-gratinato-al-forno/"},"Polenta con ragù":{"porzioni":"3 porzioni","tempo":"1 ora e 15 minuti (con ragù già pronto: 30 minuti)","ingredienti":[{"ingrediente":"Farina di mais per polenta","qta":"250 g"},{"ingrediente":"Acqua","qta":"circa 1 litro"},{"ingrediente":"Sale grosso","qta":"q.b."},{"ingrediente":"Carne macinata","qta":"300 g"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Parmigiano grattugiato","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."}],"procedimento":["Prepara il ragù: trita cipolla, carota e sedano e soffriggili in olio.","Aggiungi la carne macinata e rosolala bene.","Sfuma con il vino, se lo usi, e lascia evaporare.","Unisci la passata, sala e cuoci a fuoco basso almeno 45-60 minuti, mescolando ogni tanto.","Porta a ebollizione l'acqua salata per la polenta.","Versa la farina di mais a pioggia mescolando con una frusta per evitare grumi.","Cuoci mescolando spesso con un cucchiaio di legno per 40-50 minuti (o secondo il tempo indicato sulla confezione).","Versa la polenta nei piatti, aggiungi il ragù caldo al centro e completa con parmigiano."],"avanzi":"Buona anche il giorno dopo, il ragù migliora di sapore.","freezer":"Il ragù si può congelare separatamente dalla polenta.","ricordare":"Se vuoi accorciare i tempi, prepara il ragù il giorno prima.","link":"https://www.cookaround.com/ricetta/Polenta-al-ragu-di-carne.html"},"Polpette al sugo":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Carne macinata di manzo","qta":"400 g"},{"ingrediente":"Pane raffermo","qta":"50 g"},{"ingrediente":"Latte","qta":"q.b. per ammollare il pane"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Passata di pomodoro","qta":"500 g"},{"ingrediente":"Cipolla o aglio","qta":"1/2 cipolla o 1 spicchio d'aglio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Ammolla il pane raffermo nel latte, poi strizzalo e sbriciolalo.","Impasta la carne con pane, uovo, parmigiano, prezzemolo, sale e pepe.","Forma delle polpette della grandezza di una noce.","In un tegame soffriggi cipolla o aglio in olio con basilico.","Aggiungi la passata, sala e cuoci 5 minuti.","Adagia le polpette nel sugo, copri e cuoci a fuoco basso 25-30 minuti, girandole delicatamente ogni tanto.","Servi calde con il sugo."],"avanzi":"Ottime anche il giorno dopo.","freezer":"Si possono congelare, sia crude che già cotte nel sugo.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/polpette-al-sugo/"},"Torta salata patate e speck":{"porzioni":"4 porzioni","tempo":"50–55 minuti","ingredienti":[{"ingrediente":"Pasta sfoglia","qta":"1 rotolo"},{"ingrediente":"Patate","qta":"3 medie"},{"ingrediente":"Speck","qta":"120 g"},{"ingrediente":"Scamorza o provola","qta":"150 g"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Rosmarino","qta":"facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbuccia le patate, tagliale a cubetti e lessale (o cuoci al microonde) circa 10 minuti finché morbide.","Scolale, condiscile con olio e lasciale intiepidire.","Taglia la scamorza a dadini.","In una ciotola unisci patate, speck, scamorza, parmigiano, rosmarino, sale e pepe.","Foderare una tortiera con la pasta sfoglia.","Versa il ripieno e livella.","Ripiega i bordi della sfoglia verso il centro.","Cuoci in forno già caldo a 200°C per 25-30 minuti, finché dorata."],"avanzi":"Buona anche fredda il giorno dopo.","freezer":"Si può congelare, sia cruda che già cotta.","ricordare":"","link":"https://www.cookist.it/torta-salata-patate-e-speck/"},"Verdure miste al forno con patate":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Patate","qta":"3 medie"},{"ingrediente":"Zucchine","qta":"2"},{"ingrediente":"Peperoni","qta":"1-2"},{"ingrediente":"Melanzana","qta":"1"},{"ingrediente":"Cipolla rossa","qta":"1"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava e taglia tutte le verdure a tocchetti regolari.","Disponile su una teglia foderata, distribuendole in uno strato uniforme.","Condisci con olio, sale, pepe e rosmarino, mescola bene.","Cuoci in forno già caldo a 200°C per 35-40 minuti, girando le verdure a metà cottura, finché dorate e morbide."],"avanzi":"Buone anche il giorno dopo, ottime pure fredde.","freezer":"Si possono congelare.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/verdure-al-forno/"},"Lenticchie in umido + uovo/pane":{"porzioni":"3 porzioni","tempo":"35–40 minuti (con lenticchie già cotte)","ingredienti":[{"ingrediente":"Lenticchie già cotte","qta":"500 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"200 g"},{"ingrediente":"Alloro","qta":"1 foglia"},{"ingrediente":"Uova","qta":"3 (una a testa, all'occhio di bue)"},{"ingrediente":"Pane casereccio","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita finemente carota, sedano e cipolla.","Falli soffriggere in olio per 2-3 minuti.","Aggiungi le lenticchie scolate e l'alloro.","Unisci la passata, sala e cuoci a fuoco basso 20-25 minuti, aggiungendo acqua se si asciuga troppo.","In una padella a parte, cuoci le uova all'occhio di bue.","Servi le lenticchie con l'uovo sopra e fette di pane tostato."],"avanzi":"Le lenticchie sono ottime anche il giorno dopo; l'uovo va sempre fatto al momento.","freezer":"Le lenticchie si possono congelare (senza uovo).","ricordare":"","link":"https://blog.giallozafferano.it/annatorte/lenticchie-in-umido-con-uova-allocchio-di-bue/"},"Zuppa di lenticchie e patate":{"porzioni":"3 porzioni","tempo":"40–45 minuti (con lenticchie già cotte)","ingredienti":[{"ingrediente":"Lenticchie già cotte","qta":"400 g"},{"ingrediente":"Patate","qta":"2 medie"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"150 g"},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 700 ml"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Sbuccia le patate e tagliale a cubetti piccoli, uniscile al soffritto.","Aggiungi le lenticchie scolate e la passata.","Versa il brodo caldo, porta a bollore.","Cuoci coperto a fuoco basso 20-25 minuti, finché le patate sono morbide.","Regola di sale e pepe, servi con un filo d'olio a crudo."],"avanzi":"Ottima anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"","link":"https://www.cookist.it/zuppa-di-lenticchie-la-ricetta/"},"Frittata con avanzi":{"porzioni":"3 porzioni","tempo":"15–20 minuti","ingredienti":[{"ingrediente":"Pasta o riso avanzati","qta":"circa 300 g"},{"ingrediente":"Uova","qta":"5"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbatti le uova con parmigiano, sale e pepe.","Unisci la pasta o il riso avanzati, mescolando bene.","Scalda un filo d'olio in padella, versa il composto e livella.","Copri e cuoci a fuoco basso 6-8 minuti.","Gira la frittata con l'aiuto di un piatto e cuoci ancora 4-5 minuti dall'altro lato, finché dorata."],"avanzi":"Buona anche fredda il giorno dopo.","freezer":"Non indicata.","ricordare":"Ricetta pensata per riciclare pasta o riso avanzati dal giorno prima.","link":"https://risparmiare.mammafelice.it/cucina-degli-avanzi-la-frittata-di-pasta/"},"Frittata al forno con verdure e formaggio":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Uova","qta":"6"},{"ingrediente":"Verdure miste (zucchine, carote, spinaci)","qta":"circa 400 g"},{"ingrediente":"Latte","qta":"50 ml"},{"ingrediente":"Formaggio grattugiato","qta":"50 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava e taglia le verdure a pezzetti piccoli.","Saltale in padella con un filo d'olio per 8-10 minuti, finché morbide, regolando di sale.","Sbatti le uova con latte, formaggio, sale e pepe.","Unisci le verdure intiepidite al composto.","Versa in una teglia foderata con carta forno.","Cuoci in forno già caldo a 180°C per 25-30 minuti, finché dorata e soda al centro."],"avanzi":"Buona anche fredda, ottima per il pranzo.","freezer":"Si può congelare già porzionata.","ricordare":"","link":"https://blog.giallozafferano.it/allacciateilgrembiule/frittata-al-forno/"},"Salmone al cartoccio con limone ed erbe":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Timo","qta":"q.b."},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Adagia ogni filetto su un foglio di carta forno.","Condisci con sale, pepe, erbe aromatiche tritate e aglio, se lo usi.","Aggiungi qualche fetta di limone e un filo d'olio su ciascun filetto.","Chiudi bene i cartocci.","Cuoci in forno già caldo a 180°C per 15-20 minuti.","Apri i cartocci con attenzione al vapore e servi subito."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cookist.it/salmone-al-cartoccio-la-ricetta/"},"Polpette di tonno e patate":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Patate","qta":"3 medie"},{"ingrediente":"Tonno in scatola","qta":"250 g"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Pangrattato","qta":"per la panatura"},{"ingrediente":"Olio per friggere","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lessa le patate con la buccia finché morbide, circa 30 minuti.","Scolale, lasciale intiepidire, sbucciale e schiacciale con uno schiacciapatate.","Aggiungi il tonno sgocciolato, l'uovo, il parmigiano, il prezzemolo, sale e pepe.","Impasta bene e forma delle polpette.","Passale nel pangrattato, premendo bene.","Friggi in olio caldo finché dorate (oppure cuoci in forno a 180°C per 25-30 minuti)."],"avanzi":"Buone anche il giorno dopo.","freezer":"Si possono congelare crude, prima della cottura.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/polpette-di-tonno-e-patate/"},"Merluzzo alla mediterranea":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Pomodorini","qta":"250 g"},{"ingrediente":"Olive nere","qta":"60 g"},{"ingrediente":"Capperi","qta":"20 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Origano","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia i pomodorini a metà.","Scalda l'olio con l'aglio in padella, aggiungi i pomodorini e falli ammorbidire qualche minuto.","Unisci olive, capperi e origano.","Adagia i filetti di merluzzo nella padella, sala leggermente.","Copri e cuoci a fuoco medio 12-15 minuti, finché il pesce è cotto.","Completa con prezzemolo fresco e servi caldo."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cookist.it/filetti-di-merluzzo-alla-mediterranea/"},"Risotto ai funghi":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Funghi misti freschi","qta":"300 g"},{"ingrediente":"Scalogno o cipolla","qta":"1"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Pulisci i funghi con un panno umido e tagliali a fettine.","Trita lo scalogno e falla appassire in olio.","Aggiungi i funghi e cuocili qualche minuto, salando.","Toglili da parte tenendone qualcuno per guarnire.","Nella stessa pentola tosta il riso 1-2 minuti, sfuma con il vino se lo usi.","Aggiungi il brodo un mestolo alla volta, mescolando, per 16-18 minuti.","A metà cottura riunisci i funghi al riso.","A fuoco spento manteca con burro e parmigiano, completa con prezzemolo."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cookist.it/risotto-ai-funghi-la-ricetta/"},"Risotto radicchio e taleggio":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Radicchio","qta":"1 cespo"},{"ingrediente":"Taleggio","qta":"150 g"},{"ingrediente":"Scalogno o cipolla","qta":"1"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava il radicchio e taglialo a listarelle.","Trita lo scalogno e falla appassire in olio.","Aggiungi il radicchio e fallo insaporire qualche minuto.","Unisci il riso e tostalo 1-2 minuti, sfuma con il vino se lo usi.","Aggiungi il brodo un mestolo alla volta, mescolando, per 16-18 minuti.","A fuoco spento manteca con il taleggio a cubetti, mescolando finché cremoso.","Servi con una macinata di pepe."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/risotto-radicchio-taleggio/"},"Gnocchi al ragù":{"porzioni":"3 porzioni","tempo":"1 ora e 10 minuti (con ragù già pronto: 20 minuti)","ingredienti":[{"ingrediente":"Gnocchi di patate","qta":"600 g"},{"ingrediente":"Carne macinata mista","qta":"300 g"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Parmigiano grattugiato","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita cipolla, carota e sedano, falli soffriggere in olio.","Aggiungi la carne macinata e rosolala bene.","Sfuma con il vino, se lo usi, e lascia evaporare.","Unisci la passata, sala e pepa.","Cuoci a fuoco basso almeno 45-50 minuti, mescolando ogni tanto.","Cuoci gli gnocchi in acqua bollente salata finché vengono a galla.","Scolali e conditeli con il ragù caldo.","Servi con abbondante parmigiano."],"avanzi":"Il ragù è ottimo anche il giorno dopo; gli gnocchi vanno cotti al momento.","freezer":"Il ragù si può congelare separatamente.","ricordare":"","link":"https://www.cookist.it/gnocchi-al-ragu/"},"Minestrone ricco con legumi":{"porzioni":"4 porzioni","tempo":"45–50 minuti (con legumi già cotti)","ingredienti":[{"ingrediente":"Fagioli e ceci già cotti","qta":"300 g totali"},{"ingrediente":"Patate","qta":"1-2"},{"ingrediente":"Zucchine","qta":"1-2"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Bietole o altre verdure a foglia","qta":"facoltative, un mazzetto"},{"ingrediente":"Passata di pomodoro","qta":"facoltativa, 100 g"},{"ingrediente":"Acqua o brodo vegetale","qta":"circa 1,5 l"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava e taglia a pezzetti tutte le verdure.","Metti tutte le verdure crude in una pentola capiente con l'olio.","Copri con acqua o brodo e porta a bollore.","Cuoci a fuoco medio-basso 30-40 minuti, mescolando ogni tanto.","Aggiungi i legumi già cotti e la passata, se la usi, negli ultimi 10 minuti.","Regola di sale e pepe, servi con un filo d'olio a crudo."],"avanzi":"Ottimo anche il giorno dopo, il sapore migliora riposando.","freezer":"Si può congelare.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/minestrone-ricco/"},"Farinata di ceci con verdure/formaggi":{"porzioni":"3 porzioni","tempo":"20 minuti + riposo di 3-4 ore","ingredienti":[{"ingrediente":"Farina di ceci","qta":"150 g"},{"ingrediente":"Acqua","qta":"450 ml"},{"ingrediente":"Olio EVO","qta":"5 cucchiai"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Verdure a piacere (zucchine, cipolla) o formaggio","qta":"facoltativi, circa 150 g"},{"ingrediente":"Rosmarino","qta":"facoltativo"},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Versa la farina di ceci in una ciotola e aggiungi l'acqua poco alla volta, mescolando con una frusta per evitare grumi.","Aggiungi il sale e un cucchiaio di olio, mescola ancora.","Copri e lascia riposare a temperatura ambiente per 3-4 ore, eliminando la schiuma che si forma in superficie.","Se usi verdure a piacere, saltale brevemente in padella.","Ungi una teglia con l'olio rimasto, versa il composto e distribuisci le verdure o il formaggio, se li usi.","Cuoci in forno già molto caldo (220-230°C) per 20-25 minuti, finché dorata in superficie.","Spolvera con pepe nero e servi calda."],"avanzi":"Si conserva 2-3 giorni in frigo, si riscalda bene in forno.","freezer":"Si può congelare già tagliata.","ricordare":"L'impasto va preparato con 3-4 ore di anticipo, per far riposare la farina di ceci.","link":"https://www.tavolartegusto.it/ricetta/ricetta-farinata-di-ceci/"},"Pesce al forno alla mediterranea":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Filetti di pesce bianco (orata, branzino o simili)","qta":"3 (circa 180 g l'uno)"},{"ingrediente":"Pomodorini","qta":"200 g"},{"ingrediente":"Olive nere","qta":"60 g"},{"ingrediente":"Capperi","qta":"20 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Origano","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Adagia i filetti di pesce in una teglia foderata con carta forno.","Cospargi con origano, aglio tritato, sale e un filo d'olio.","Distribuisci pomodorini tagliati a metà, olive e capperi intorno e sopra il pesce.","Cuoci in forno già caldo a 200°C per 20-25 minuti, finché il pesce è cotto.","Completa con prezzemolo fresco prima di servire."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://spadellandia.it/secondi/pesce/orata-al-forno-alla-mediterranea/"},"Salmone in crosta":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Pangrattato","qta":"80 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Timo","qta":"q.b."},{"ingrediente":"Limone (scorza)","qta":"1"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Adagia i filetti di salmone su una teglia foderata con carta forno.","Mescola pangrattato, erbe tritate, scorza di limone, sale, pepe e un filo d'olio.","Distribuisci il composto sopra i filetti, premendo leggermente per farlo aderire.","Cuoci in forno già caldo a 200°C per 18-20 minuti, finché la crosta è dorata.","Servi caldo, eventualmente con patate al forno come contorno."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/salmone-in-crosta-con-patate-al-forno/"},"Salmone con patate al forno":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Filetti di salmone","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbuccia le patate e tagliale a spicchi sottili.","Disponile in una teglia con olio, aglio, sale e rosmarino.","Cuoci in forno a 200°C per 20 minuti.","Aggiungi i filetti di salmone sopra o accanto alle patate, condisci con succo di limone, sale e un filo d'olio.","Continua la cottura per altri 15-18 minuti, finché il pesce è cotto e le patate dorate."],"avanzi":"Meglio fresco, il pesce cotto perde consistenza se riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.agrodolce.it/ricette/salmone-e-patate-al-forno"},"Merluzzo gratinato con patate":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Filetti di merluzzo","qta":"3 (circa 150 g l'uno)"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Pangrattato","qta":"80 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbuccia le patate e tagliale a fettine sottili.","Disponile in una teglia con olio, sale e un filo d'olio, cuoci in forno a 200°C per 15 minuti.","Nel frattempo mescola pangrattato, aglio, prezzemolo e un filo d'olio.","Adagia i filetti di merluzzo sulle patate, condisci con sale e ricopri con la panatura.","Continua la cottura per altri 15-18 minuti, finché il pesce è cotto e la panatura dorata."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://blog.giallozafferano.it/peperoncino88/merluzzo-gratinato-con-patate/"},"Polpette di tonno, ricotta e parmigiano":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Tonno in scatola","qta":"250 g"},{"ingrediente":"Ricotta","qta":"150 g"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Pangrattato","qta":"per la panatura"},{"ingrediente":"Olio per friggere","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["In una ciotola unisci tonno sgocciolato, ricotta ben scolata e uovo, amalgamando con una forchetta.","Aggiungi parmigiano e prezzemolo tritato, mescola ancora.","Unisci pangrattato poco alla volta finché l'impasto è modellabile.","Lascia riposare in frigo 15 minuti.","Forma le polpette e passale nel pangrattato.","Friggi in olio caldo finché dorate (oppure cuoci in forno a 180°C per 20-25 minuti)."],"avanzi":"Buone anche il giorno dopo.","freezer":"Si possono congelare crude.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/polpette-di-tonno-e-ricotta/"},"Pollo alla valdostana":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Petto di pollo","qta":"500 g"},{"ingrediente":"Prosciutto cotto","qta":"6 fette"},{"ingrediente":"Fontina","qta":"150 g"},{"ingrediente":"Farina","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Passa le fettine di pollo nella farina.","Scalda l'olio in padella e rosola il pollo 3-4 minuti per lato, salando.","Disponi su ogni fettina una fetta di prosciutto cotto e una di fontina.","Copri con un coperchio e cuoci a fuoco basso finché il formaggio si è sciolto.","Servi caldo, appena il formaggio è filante."],"avanzi":"Meglio fresco, il formaggio filante non rende bene riscaldato.","freezer":"Non adatto.","ricordare":"","link":"https://www.cookist.it/pollo-alla-valdostana-la-ricetta/"},"Zucchine ripiene":{"porzioni":"3 porzioni","tempo":"55–60 minuti","ingredienti":[{"ingrediente":"Zucchine","qta":"4-5"},{"ingrediente":"Carne macinata","qta":"300 g"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Pane raffermo","qta":"1 fetta"},{"ingrediente":"Pangrattato","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Passata di pomodoro","qta":"facoltativa, 200 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbollenta le zucchine intere per 5 minuti, poi taglia a metà o in tronchetti e svuota la polpa con un cucchiaino.","Trita la polpa e uniscila alla carne macinata, uovo, parmigiano, pane strizzato, prezzemolo, sale e pepe.","Amalgama bene fino a un composto omogeneo.","Farcisci le zucchine con il ripieno, premendo leggermente.","Disponile in una teglia, eventualmente con la passata di pomodoro sul fondo.","Cuoci in forno già caldo a 190°C per 30-35 minuti, finché dorate."],"avanzi":"Buone anche il giorno dopo.","freezer":"Si possono congelare, sia crude che già cotte.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/zucchine-ripiene-di-carne/"},"Zuppa di legumi e cereali":{"porzioni":"4 porzioni","tempo":"45–50 minuti (con legumi già cotti)","ingredienti":[{"ingrediente":"Legumi misti già cotti (ceci, fagioli, lenticchie)","qta":"400 g"},{"ingrediente":"Cereali misti (farro, orzo perlato)","qta":"150 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Pomodori o pelati","qta":"200 g"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Alloro","qta":"q.b."},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 1 litro"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Aggiungi i cereali (se non perlati, sciacquali prima) e fai insaporire un minuto.","Unisci i pomodori, il rosmarino e l'alloro.","Versa il brodo caldo, porta a bollore.","Cuoci a fuoco medio-basso 25-30 minuti, finché i cereali sono teneri.","Aggiungi i legumi già cotti negli ultimi 10 minuti.","Regola di sale e pepe, servi con un filo d'olio a crudo."],"avanzi":"Ottima anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"","link":"https://www.ilclubdellericette.it/ricetta/zuppa-di-legumi-e-cereali"},"Pollo al forno con senape e miele":{"porzioni":"3 porzioni","tempo":"1 ora (con marinatura)","ingredienti":[{"ingrediente":"Cosce o sovracosce di pollo","qta":"6"},{"ingrediente":"Senape","qta":"3 cucchiai"},{"ingrediente":"Miele","qta":"3 cucchiai"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Aglio","qta":"1-2 spicchi"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["In una ciotola mescola senape, miele, succo di limone, olio, aglio tritato, rosmarino, sale e pepe.","Massaggia il pollo con la marinata, copri e lascia riposare in frigo almeno 30 minuti.","Disponi il pollo in una teglia con il fondo di cottura.","Cuoci in forno già caldo a 190°C per 40-45 minuti, girando e bagnando con il fondo di cottura ogni 15 minuti.","Sforna quando la pelle è dorata e caramellata."],"avanzi":"Buono anche il giorno dopo.","freezer":"Non indicato.","ricordare":"Marinare il pollo almeno 30 minuti prima di infornare.","link":"https://www.dissapore.com/ricette/petti-di-pollo-alla-senape-miele/"},"Straccetti di manzo al balsamico":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Straccetti di manzo","qta":"400 g"},{"ingrediente":"Farina","qta":"40 g"},{"ingrediente":"Aceto balsamico","qta":"2-3 cucchiai"},{"ingrediente":"Rucola","qta":"un mazzetto"},{"ingrediente":"Parmigiano a scaglie","qta":"40 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Infarina leggermente gli straccetti.","Scalda l'olio in padella e rosola la carne a fuoco vivace per 2-3 minuti per lato.","Sala e pepa.","Sfuma con l'aceto balsamico, lascia restringere un minuto mescolando.","Prepara un letto di rucola in un piatto da portata.","Adagia gli straccetti caldi sulla rucola e completa con scaglie di parmigiano."],"avanzi":"Meglio fresco, la carne sottile perde consistenza se riscaldata.","freezer":"Non adatto.","ricordare":"","link":"https://www.saporie.com/ricette-degli-chef/secondi-piatti/straccetti-di-manzo-allaceto-balsamico-con-rucola-e-parmigiano-reggiano-dop"},"Ossobuco alla milanese + risotto allo zafferano":{"porzioni":"3 porzioni","tempo":"1 ora e 30 minuti","ingredienti":[{"ingrediente":"Ossibuchi di vitello","qta":"3"},{"ingrediente":"Farina","qta":"per infarinare"},{"ingrediente":"Cipolla","qta":"1"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Brodo di carne","qta":"circa 500 ml"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Aglio","qta":"q.b."},{"ingrediente":"Scorza di limone","qta":"q.b."},{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Zafferano","qta":"1 bustina"},{"ingrediente":"Burro","qta":"50 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Incidi la pellicina degli ossibuchi, infarinali e rosolali in olio da entrambi i lati.","Togli la carne, rosola la cipolla tritata nello stesso tegame.","Rimetti gli ossibuchi, sfuma con il vino.","Copri con il brodo caldo, incoperchia e cuoci a fuoco basso 50-60 minuti, aggiungendo brodo se serve.","Prepara la gremolada tritando prezzemolo, aglio e scorza di limone.","Per il risotto: tosta il riso, sfuma con vino se vuoi, aggiungi il brodo un mestolo alla volta per 16-18 minuti.","Sciogli lo zafferano in un po' di brodo caldo e uniscilo a metà cottura.","Manteca con burro e parmigiano.","Servi il risotto con l'ossobuco sopra, completando con la gremolada."],"avanzi":"L'ossobuco è ottimo anche il giorno dopo; il risotto va preparato fresco.","freezer":"L'ossobuco si può congelare; il risotto no.","ricordare":"","link":"https://www.cortilia.it/ricette/autunno/ossobuco-e-risotto-alla-milanese"},"Polpettone al sugo":{"porzioni":"4 porzioni","tempo":"1 ora e 10 minuti","ingredienti":[{"ingrediente":"Carne macinata mista","qta":"600 g"},{"ingrediente":"Uova","qta":"2"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Pangrattato","qta":"50 g"},{"ingrediente":"Mozzarella o provola (facoltativa)","qta":"100 g"},{"ingrediente":"Passata di pomodoro","qta":"500 g"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["In una ciotola unisci carne, uova, parmigiano, pangrattato, sale e pepe.","Amalgama bene e forma un rettangolo su carta forno.","Se vuoi il cuore filante, distribuisci la mozzarella al centro e arrotola stringendo con la carta forno.","Prepara il sugo: soffriggi la cipolla in olio con basilico, aggiungi la passata e sala.","Adagia delicatamente il polpettone nel sugo bollente, ricoprendolo di sugo anche sopra.","Copri e cuoci a fuoco medio-basso 40 minuti, girandolo delicatamente a metà cottura.","Lascia riposare 10 minuti prima di tagliare e servire con il sugo."],"avanzi":"Ottimo anche il giorno dopo.","freezer":"Si può congelare già cotto.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/polpettone-al-sugo-ricetta/"},"Hamburger fatti in casa":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Carne macinata di manzo","qta":"450 g"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Panini per hamburger","qta":"3"},{"ingrediente":"Formaggio grattugiato","qta":"a piacere"},{"ingrediente":"Insalata","qta":"a piacere"},{"ingrediente":"Pomodoro","qta":"a piacere"}],"procedimento":["Lascia la carne a temperatura ambiente 20-30 minuti prima di lavorarla.","Condisci con sale, pepe e prezzemolo se lo usi, senza impastare troppo per non renderla dura.","Forma 3 dischi di circa 150 g ciascuno, non troppo compattati.","Scalda bene una padella o piastra.","Cuoci gli hamburger 3-4 minuti per lato, girandoli una sola volta.","Se usi il formaggio, aggiungilo un minuto prima di fine cottura e copri con un coperchio per farlo sciogliere.","Componi il panino con gli ingredienti scelti."],"avanzi":"Meglio fresco appena cotto.","freezer":"Si possono congelare crudi.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/hamburger-ricetta/"},"Spezzatino di manzo con patate":{"porzioni":"3 porzioni","tempo":"1 ora e 40 minuti","ingredienti":[{"ingrediente":"Polpa di manzo per spezzatino","qta":"500 g"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"200 g"},{"ingrediente":"Vino rosso","qta":"mezzo bicchiere"},{"ingrediente":"Farina","qta":"per infarinare"},{"ingrediente":"Brodo o acqua","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia la carne a cubotti, infarinala leggermente.","Trita carota, sedano e cipolla, falli soffriggere in olio.","Aggiungi la carne e rosolala a fuoco vivace finché dorata.","Sfuma con il vino, lascia evaporare.","Unisci la passata, sala e pepa, copri con acqua o brodo.","Cuoci coperto a fuoco basso circa 1 ora, mescolando ogni tanto.","Sbuccia le patate, tagliale a tocchetti e aggiungile.","Continua la cottura altri 25-30 minuti, finché carne e patate sono morbide."],"avanzi":"Ottimo anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/spezzatino-con-patate/"},"Pizza fatta in casa":{"porzioni":"3 pizze","tempo":"40 minuti + 5-6 ore di lievitazione","ingredienti":[{"ingrediente":"Farina 00 (o mix con Manitoba)","qta":"500 g"},{"ingrediente":"Acqua","qta":"320 ml"},{"ingrediente":"Lievito di birra fresco","qta":"4 g (o 1,5 g secco)"},{"ingrediente":"Sale","qta":"12 g"},{"ingrediente":"Olio EVO","qta":"2 cucchiai"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Mozzarella","qta":"300 g"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Origano","qta":"q.b."}],"procedimento":["Sciogli il lievito in poca acqua tiepida.","Nella ciotola dell'impastatrice (o a mano) unisci farina, acqua con il lievito e inizia a impastare.","Aggiungi il sale a metà impasto, mai a contatto diretto col lievito.","Verso la fine incorpora l'olio a filo.","Impasta finché liscio ed elastico, forma una palla e lascia lievitare coperta 1-2 ore a temperatura ambiente.","Dividi in 3 palline, lascia lievitare ancora 3-4 ore (o in frigo tutta la notte).","Stendi ogni pallina, condisci con passata, mozzarella e origano.","Cuoci in forno il più caldo possibile (idealmente 250°C) per 8-10 minuti, sul ripiano più basso."],"avanzi":"Buona anche il giorno dopo, si riscalda bene in padella o forno.","freezer":"L'impasto crudo si può congelare a palline.","ricordare":"L'impasto ha bisogno di diverse ore di lievitazione: va preparato in anticipo.","link":"https://www.cookaround.com/ricetta/Impasto-per-la-pizza.html"},"Parmigiana di zucchine":{"porzioni":"4 porzioni","tempo":"1 ora","ingredienti":[{"ingrediente":"Zucchine","qta":"1 kg"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Mozzarella","qta":"250 g"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le zucchine a fette sottili nel senso della lunghezza.","Grigliale su una piastra calda 2 minuti per lato (oppure cuocile in forno a 200°C per 15 minuti).","Prepara il sugo: soffriggi l'aglio in olio, aggiungi la passata, sala e cuoci 15 minuti con basilico.","Scola bene la mozzarella e tagliala a dadini.","In una teglia crea strati alternando zucchine, sugo, mozzarella e parmigiano.","Ripeti fino a esaurire gli ingredienti, terminando con sugo e parmigiano.","Cuoci in forno già caldo a 180°C per 30 minuti.","Lascia riposare qualche minuto prima di servire."],"avanzi":"Buona anche fredda il giorno dopo.","freezer":"Si può congelare già porzionata.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/parmigiana-di-zucchine/"},"Vellutata di zucca":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Zucca","qta":"600 g di polpa"},{"ingrediente":"Patate","qta":"150 g"},{"ingrediente":"Porro o cipolla","qta":"1"},{"ingrediente":"Brodo vegetale","qta":"circa 500 ml"},{"ingrediente":"Rosmarino","qta":"facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia la zucca e le patate a cubetti.","Affetta il porro o la cipolla e falli appassire in olio.","Aggiungi zucca e patate, fai insaporire qualche minuto con il rosmarino se lo usi.","Copri con il brodo caldo e cuoci 25-30 minuti, finché le verdure sono morbide.","Frulla tutto con un frullatore a immersione fino a crema liscia.","Regola di sale e pepe, servi con un filo d'olio e, se vuoi, crostini di pane."],"avanzi":"Ottima anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"","link":"https://www.cookist.it/vellutata-di-zucca-la-ricetta/"},"Focaccia":{"porzioni":"6 porzioni","tempo":"30 minuti + 3-4 ore di lievitazione","ingredienti":[{"ingrediente":"Farina 0 (o mix con Manitoba)","qta":"500 g"},{"ingrediente":"Acqua","qta":"400 ml"},{"ingrediente":"Lievito di birra fresco","qta":"10 g (o 3 g secco)"},{"ingrediente":"Olio EVO","qta":"90 ml"},{"ingrediente":"Sale","qta":"10 g"},{"ingrediente":"Zucchero o miele","qta":"1 cucchiaino"},{"ingrediente":"Sale grosso","qta":"q.b."}],"procedimento":["Sciogli il lievito in un po' di acqua tiepida con lo zucchero o il miele.","Unisci la farina, l'acqua col lievito e il resto dell'acqua, inizia a impastare.","Aggiungi l'olio a filo, poi il sale, continuando a impastare finché l'impasto è liscio ed elastico.","Forma una palla, copri e lascia lievitare 1-2 ore a temperatura ambiente, fino al raddoppio.","Ungi una teglia con olio, trasferisci l'impasto e stendilo delicatamente con le mani senza sgonfiarlo.","Lascia lievitare ancora circa 1 ora coperta.","Con le dita unte d'olio, crea i classici buchi profondi sulla superficie.","Emulsiona olio, acqua e sale grosso per la salamoia e versala sulla focaccia.","Cuoci in forno già caldo a 220°C per 20-25 minuti, finché dorata."],"avanzi":"Buona anche il giorno dopo, si riscalda bene in forno.","freezer":"Si può congelare già cotta, a tranci.","ricordare":"L'impasto va preparato con 3-4 ore di anticipo per la lievitazione.","link":"https://www.accademianazionalepizzadoc.it/focaccia-genovese-ricetta-fugassa-ligure-originale/"},"Gricia":{"porzioni":"3 porzioni","tempo":"15–20 minuti","ingredienti":[{"ingrediente":"Rigatoni o spaghetti","qta":"240 g"},{"ingrediente":"Guanciale","qta":"150 g"},{"ingrediente":"Pecorino romano grattugiato","qta":"100 g"},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia il guanciale a listarelle spesse mezzo centimetro.","Mettilo in padella fredda senza aggiungere grassi e falla rosolare a fuoco medio finché croccante.","Metti a bollire l'acqua per la pasta, sala solo a bollore.","Cuoci la pasta, tenendo da parte un mestolo di acqua di cottura.","In una ciotola prepara una crema con pecorino, pepe e un po' di acqua di cottura, senza grumi.","Scola la pasta e uniscila al guanciale nella padella.","Togli dal fuoco e manteca con la crema di pecorino, aggiungendo acqua di cottura se serve."],"avanzi":"Meglio fresca, va preparata al momento e consumata subito.","freezer":"Non adatta.","ricordare":"","link":"https://www.soniaperonaci.it/pasta-alla-gricia/"},"Puttanesca":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Spaghetti","qta":"240 g"},{"ingrediente":"Pomodori pelati o pomodorini freschi","qta":"400 g"},{"ingrediente":"Olive nere di Gaeta","qta":"80 g"},{"ingrediente":"Capperi","qta":"30 g"},{"ingrediente":"Acciughe sott'olio","qta":"3-4 filetti"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Peperoncino","qta":"facoltativo"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."}],"procedimento":["Scalda l'olio con l'aglio in camicia e il peperoncino, se lo usi.","Aggiungi le acciughe e falle sciogliere con il dorso di un cucchiaio.","Unisci capperi e olive, fai insaporire un minuto.","Aggiungi i pomodori a filetti o i pomodorini a metà.","Sala poco (gli ingredienti sono già sapidi), cuoci 10-15 minuti.","Cuoci la pasta, scolala e falla saltare nel sugo un paio di minuti.","Completa con prezzemolo fresco tritato."],"avanzi":"Buona anche il giorno dopo, riposando prende ancora più sapore.","freezer":"Non indicata.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/pasta-alla-puttanesca/"},"Ragù":{"porzioni":"4 porzioni (base per più pasti)","tempo":"2 ore e 30 minuti","ingredienti":[{"ingrediente":"Carne macinata di manzo","qta":"400 g"},{"ingrediente":"Pancetta a cubetti","qta":"150 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Vino rosso o bianco","qta":"1 bicchiere"},{"ingrediente":"Passata di pomodoro","qta":"200 g"},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio"},{"ingrediente":"Latte","qta":"facoltativo, 1 bicchiere"},{"ingrediente":"Brodo di carne o vegetale","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita finemente carota, sedano e cipolla, e la pancetta.","Fai sciogliere la pancetta in un tegame con l'olio.","Aggiungi il trito di verdure e fai rosolare 5 minuti.","Unisci la carne macinata e falla rosolare bene, sfumando con il vino.","Aggiungi concentrato e passata di pomodoro.","Cuoci a fuoco molto basso per 2-3 ore, aggiungendo brodo poco alla volta se si asciuga.","Verso fine cottura unisci il latte, se lo usi, per ammorbidire l'acidità.","Regola di sale e pepe."],"avanzi":"Ottimo il giorno dopo, il sapore migliora molto riposando.","freezer":"Si può congelare in porzioni.","ricordare":"Richiede cottura lenta di almeno 2 ore: prevedere tempo o prepararlo in anticipo.","link":"https://www.tavolartegusto.it/ricetta/ragu-alla-bolognese-la-ricetta-originale-come-fare-il-ragu/"},"Cannelloni ricotta e spinaci":{"porzioni":"4 porzioni","tempo":"1 ora e 10 minuti","ingredienti":[{"ingrediente":"Cannelloni (secchi o sfoglie di pasta fresca)","qta":"16-18"},{"ingrediente":"Spinaci","qta":"500 g"},{"ingrediente":"Ricotta","qta":"300 g"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Besciamella","qta":"circa 400 ml"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Olio EVO o burro","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lessa gli spinaci, scolali, strizzali bene e tritali.","Mescola gli spinaci con ricotta, uovo, parmigiano, sale, pepe e noce moscata.","Se usi cannelloni secchi, sbollentali brevemente; se usi sfoglie fresche, sbollentale 1-2 minuti.","Farcisci ogni cannellone con il ripieno, usando un cucchiaio o una sac à poche.","Versa un po' di besciamella sul fondo di una teglia, disponi i cannelloni.","Ricopri con la besciamella rimasta e una spolverata di parmigiano.","Cuoci in forno già caldo a 200°C per 25-30 minuti, finché dorati in superficie."],"avanzi":"Buoni anche il giorno dopo, si riscaldano bene in forno.","freezer":"Si possono congelare, sia crudi che già cotti.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/cannelloni-ricotta-spinaci/"},"Pasta al forno bianca con besciamella, prosciutto e mozzarella":{"porzioni":"4 porzioni","tempo":"50 minuti","ingredienti":[{"ingrediente":"Pasta corta (mezze maniche o penne)","qta":"350 g"},{"ingrediente":"Besciamella","qta":"circa 600 ml"},{"ingrediente":"Prosciutto cotto","qta":"150 g"},{"ingrediente":"Mozzarella","qta":"200 g"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Cuoci la pasta molto al dente (2-3 minuti in meno del tempo indicato) e scolala.","Scola bene la mozzarella e tagliala a cubetti.","In una ciotola condisci la pasta con besciamella, prosciutto e metà della mozzarella.","Versa in una teglia imburrata, distribuisci la mozzarella rimasta e il parmigiano.","Cuoci in forno già caldo a 200°C per 25-30 minuti, finché dorata in superficie."],"avanzi":"Buona anche il giorno dopo, si riscalda bene in forno.","freezer":"Si può congelare, sia cruda che già cotta.","ricordare":"","link":"https://www.salepepe.it/ricette/primi/pasta-secca/maccheroni-o-mezze-maniche/pasta-al-forno-bianca/"},"Pasta con salsiccia e funghi":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Pasta corta (penne o mezze maniche)","qta":"240 g"},{"ingrediente":"Salsiccia","qta":"300 g"},{"ingrediente":"Funghi misti freschi","qta":"300 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Pulisci i funghi e affettali.","Scalda l'olio con l'aglio, aggiungi la salsiccia sbriciolata e falla rosolare 10 minuti.","Sfuma con il vino, se lo usi, e lascia evaporare.","Aggiungi i funghi e cuoci ancora 8-10 minuti.","Regola di sale e pepe.","Cuoci la pasta, scolala e mantecala nel condimento con un po' di acqua di cottura.","Completa con prezzemolo e parmigiano."],"avanzi":"Buona anche il giorno dopo.","freezer":"Il condimento si può congelare senza pasta.","ricordare":"","link":"https://www.cookist.it/pasta-funghi-e-salsiccia/"},"Spaghetti con pomodorini":{"porzioni":"3 porzioni","tempo":"20–25 minuti","ingredienti":[{"ingrediente":"Spaghetti","qta":"240 g"},{"ingrediente":"Pomodorini","qta":"500 g"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Lava i pomodorini e tagliali a metà.","Scalda l'olio con l'aglio in una padella ampia.","Aggiungi i pomodorini, sala e cuoci 8-10 minuti a fuoco vivace, finché si ammorbidiscono.","Cuoci la pasta, scolala al dente conservando un po' di acqua di cottura.","Fai saltare la pasta nella padella con i pomodorini, allungando con acqua di cottura se serve.","Completa con basilico fresco spezzettato."],"avanzi":"Meglio fresca, i pomodorini freschi perdono consistenza da riscaldati.","freezer":"Non indicata.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/spaghetti-con-pomodorini/"},"Pasta con melanzane e ricotta salata":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Pasta corta (rigatoni o penne)","qta":"240 g"},{"ingrediente":"Melanzane","qta":"2"},{"ingrediente":"Passata di pomodoro","qta":"350 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Ricotta salata","qta":"70 g"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio per friggere","qta":"abbondante"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le melanzane a cubetti e friggile in olio caldo fino a doratura, poi scolale su carta assorbente.","In una padella scalda l'olio con l'aglio, aggiungi la passata, sala e cuoci 15-20 minuti con basilico.","Cuoci la pasta, scolala e mantecala nel sugo con circa metà delle melanzane fritte.","Impiatta e completa con le melanzane rimaste, basilico fresco e abbondante ricotta salata grattugiata."],"avanzi":"Buona anche il giorno dopo.","freezer":"Il sugo (senza melanzane fritte) si può congelare.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/pasta-alla-norma/"},"Pasta e patate":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Pasta mista o corta","qta":"200 g"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Pomodorini o concentrato di pomodoro","qta":"150 g o 1 cucchiaio"},{"ingrediente":"Croste di parmigiano (facoltative)","qta":"1-2"},{"ingrediente":"Parmigiano grattugiato","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Sbuccia le patate e tagliale a tocchetti, uniscile al soffritto.","Aggiungi i pomodorini o il concentrato, sala.","Copri con acqua, aggiungi le croste di parmigiano se le usi.","Cuoci 20-25 minuti, finché le patate iniziano a disfarsi.","Aggiungi la pasta direttamente nella pentola con le patate, con un po' di acqua se serve.","Cuoci fino a cottura della pasta, mescolando spesso.","Lascia riposare qualche minuto coperta, servi con parmigiano e un filo d'olio."],"avanzi":"Ottima anche il giorno dopo, tende ad addensarsi: aggiungi un po' di acqua per riscaldarla.","freezer":"Non indicata, la pasta si sfalda.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/pasta-e-patate-la-ricetta-napoletana/"},"Pasta con broccoli e salsiccia":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Pasta corta (orecchiette o fusilli)","qta":"240 g"},{"ingrediente":"Broccoli","qta":"1 (circa 500 g)"},{"ingrediente":"Salsiccia","qta":"250 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Peperoncino","qta":"facoltativo"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Dividi i broccoli a cimette, lavali.","Sbollentali in acqua bollente salata 7-8 minuti, scolali tenendo da parte l'acqua di cottura.","Nella stessa acqua cuocerai poi la pasta.","In una padella scalda l'olio con aglio e peperoncino, se lo usi.","Aggiungi la salsiccia sbriciolata e falla rosolare, sfumando con il vino.","Unisci i broccoli, schiacciandone una parte con una forchetta per creare una crema.","Cuoci la pasta nell'acqua dei broccoli, scolala e uniscila al condimento.","Manteca con un po' di acqua di cottura e completa con parmigiano."],"avanzi":"Meglio fresca, i broccoli perdono consistenza se riscaldati.","freezer":"Non indicata.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/pasta-con-broccoli-e-salsiccia/"},"Risotto alla zucca":{"porzioni":"3 porzioni","tempo":"40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Zucca","qta":"400 g di polpa"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia la zucca a cubetti.","Trita la cipolla e falla appassire in olio.","Aggiungi la zucca e falla cuocere qualche minuto, poi bagna con un mestolo di brodo caldo e cuoci finché morbida.","Frulla circa metà della zucca cotta con un po' di brodo per ottenere una crema.","Nella stessa pentola tosta il riso 1-2 minuti, sfuma con il vino se lo usi.","Aggiungi il brodo un mestolo alla volta, mescolando, per 16-18 minuti.","A metà cottura unisci la crema di zucca e i pezzetti tenuti da parte.","A fuoco spento manteca con burro, parmigiano e noce moscata."],"avanzi":"Meglio fresco.","freezer":"Non adatto.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/risotto-alla-zucca/"},"Risotto agli asparagi":{"porzioni":"3 porzioni","tempo":"35 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Asparagi","qta":"1 mazzo"},{"ingrediente":"Cipolla","qta":"1/2"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Burro","qta":"20 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Elimina la parte dura del gambo degli asparagi (tienila da parte per il brodo) e taglia il resto a rondelle, tenendo le punte intere.","Trita la cipolla e falla appassire in olio.","Aggiungi gli asparagi a rondelle e fai insaporire qualche minuto.","Unisci il riso e tostalo 1-2 minuti, sfuma con il vino se lo usi.","Aggiungi il brodo un mestolo alla volta, mescolando, per 16-18 minuti.","A metà cottura unisci le punte degli asparagi.","A fuoco spento manteca con burro e parmigiano."],"avanzi":"Meglio fresco.","freezer":"Non indicato.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/risotto-agli-asparagi/"},"Gnocchi alla romana":{"porzioni":"3 porzioni","tempo":"50 minuti","ingredienti":[{"ingrediente":"Semolino","qta":"150 g"},{"ingrediente":"Latte","qta":"600 ml"},{"ingrediente":"Burro","qta":"60 g"},{"ingrediente":"Parmigiano grattugiato","qta":"70 g"},{"ingrediente":"Tuorli","qta":"2"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Porta il latte a bollore con metà del burro, sale e noce moscata.","Versa il semolino a pioggia, mescolando con una frusta per evitare grumi.","Cuoci mescolando finché il composto si addensa, circa 5 minuti.","Togli dal fuoco, aggiungi i tuorli e metà del parmigiano, mescola bene.","Stendi il composto caldo su un piano bagnato o carta forno, a uno spessore di circa 1 cm, e lascia raffreddare.","Con un coppapasta o un bicchiere ricava dei dischi.","Disponi i dischi leggermente sovrapposti in una teglia imburrata.","Copri con il burro rimasto a fiocchetti e il parmigiano.","Cuoci in forno già caldo a 200°C per 20-25 minuti, finché dorati."],"avanzi":"Buoni anche il giorno dopo, si riscaldano bene in forno.","freezer":"Si possono congelare già formati, prima della cottura in forno.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/ricetta-gnocchi-alla-romana/"},"Risotto salsiccia e funghi":{"porzioni":"3 porzioni","tempo":"40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Salsiccia","qta":"250 g"},{"ingrediente":"Funghi misti freschi","qta":"250 g"},{"ingrediente":"Cipolla o scalogno","qta":"1"},{"ingrediente":"Brodo vegetale","qta":"circa 700 ml"},{"ingrediente":"Vino bianco o rosso","qta":"mezzo bicchiere"},{"ingrediente":"Burro","qta":"20 g"},{"ingrediente":"Parmigiano grattugiato","qta":"50 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Pulisci i funghi e affettali.","Trita la cipolla e falla appassire in olio.","Aggiungi la salsiccia sbriciolata e falla rosolare.","Unisci i funghi e cuoci qualche minuto, sfumando con il vino.","Aggiungi il riso e tostalo 1-2 minuti.","Versa il brodo un mestolo alla volta, mescolando, per 16-18 minuti.","A fuoco spento manteca con burro e parmigiano, completa con prezzemolo."],"avanzi":"Meglio fresco.","freezer":"Non indicato.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/risotto-ai-funghi-e-salsiccia/"},"Polenta con salsiccia e funghi":{"porzioni":"3 porzioni","tempo":"55 minuti","ingredienti":[{"ingrediente":"Farina di mais per polenta","qta":"250 g"},{"ingrediente":"Acqua","qta":"circa 1 litro"},{"ingrediente":"Sale grosso","qta":"q.b."},{"ingrediente":"Salsiccia","qta":"300 g"},{"ingrediente":"Funghi misti freschi","qta":"300 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Porta a ebollizione l'acqua salata per la polenta.","Versa la farina di mais a pioggia mescolando con una frusta.","Cuoci mescolando spesso per 40-45 minuti (o secondo il tempo indicato sulla confezione).","Nel frattempo scalda l'olio con l'aglio, aggiungi la salsiccia sbriciolata e falla rosolare.","Unisci i funghi puliti e affettati, sfumando con il vino se lo usi.","Cuoci 10-15 minuti, regola di sale e pepe.","Versa la polenta nei piatti, completa con salsiccia e funghi e prezzemolo fresco."],"avanzi":"Buona anche il giorno dopo, la polenta si può anche grigliare a fette.","freezer":"Il condimento si può congelare separatamente.","ricordare":"","link":"https://www.cookist.it/risotto-funghi-e-salsiccia-ricetta/"},"Pasta al forno":{"porzioni":"4 porzioni","tempo":"1 ora e 10 minuti","ingredienti":[{"ingrediente":"Pasta corta (rigatoni o mezze maniche)","qta":"350 g"},{"ingrediente":"Carne macinata mista","qta":"300 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Vino rosso","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Besciamella","qta":"circa 400 ml"},{"ingrediente":"Mozzarella","qta":"200 g"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Aggiungi la carne macinata e rosolala bene, sfumando con il vino se lo usi.","Unisci la passata, sala e cuoci a fuoco basso 45-50 minuti.","Cuoci la pasta molto al dente e scolala.","Condisci la pasta con il ragù, la besciamella e metà della mozzarella a cubetti.","Versa in una teglia, distribuisci la mozzarella rimasta e il parmigiano.","Cuoci in forno già caldo a 200°C per 20-25 minuti, finché dorata in superficie."],"avanzi":"Buona anche il giorno dopo, si riscalda bene in forno.","freezer":"Si può congelare, sia cruda che già cotta.","ricordare":"","link":"https://www.cookaround.com/ricetta/pasta-al-forno.html"},"Pasta con ricotta, spinaci e parmigiano":{"porzioni":"3 porzioni","tempo":"25 minuti","ingredienti":[{"ingrediente":"Pasta corta (fusilli o mezze maniche)","qta":"240 g"},{"ingrediente":"Spinaci","qta":"300 g"},{"ingrediente":"Ricotta","qta":"200 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Noce moscata","qta":"facoltativa"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Scalda l'olio con l'aglio in padella, aggiungi gli spinaci e cuocili finché appassiti.","Sala, elimina l'aglio e frulla grossolanamente gli spinaci.","In una ciotola lavora la ricotta con parmigiano, sale, pepe e noce moscata.","Cuoci la pasta, scolala tenendo un po' di acqua di cottura.","Fai saltare la pasta con gli spinaci, poi unisci la ricotta lontano dal fuoco, allungando con acqua di cottura.","Completa con altro parmigiano."],"avanzi":"Buona anche il giorno dopo.","freezer":"Non indicata.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/pasta-ricotta-e-spinaci/"},"Cannelloni di carne":{"porzioni":"4 porzioni","tempo":"1 ora e 30 minuti","ingredienti":[{"ingrediente":"Cannelloni (secchi o sfoglie di pasta fresca)","qta":"16-18"},{"ingrediente":"Carne macinata mista","qta":"400 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Passata di pomodoro","qta":"400 g"},{"ingrediente":"Vino bianco","qta":"facoltativo, mezzo bicchiere"},{"ingrediente":"Besciamella","qta":"circa 400 ml"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Aggiungi la carne e rosolala, sfumando con il vino se lo usi.","Unisci la passata, sala e cuoci a fuoco basso 45-60 minuti.","Lascia intiepidire il ragù, poi usalo per farcire i cannelloni (sbolliti brevemente se secchi).","Versa un po' di besciamella sul fondo di una teglia, disponi i cannelloni farciti.","Ricopri con besciamella rimasta e parmigiano.","Cuoci in forno già caldo a 190°C per 30 minuti, finché dorati."],"avanzi":"Buoni anche il giorno dopo.","freezer":"Si possono congelare, sia crudi che già cotti.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/cannelloni-di-carne/"},"Pasta con patate e pancetta":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Pasta mista o corta","qta":"200 g"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Pancetta a cubetti","qta":"100 g"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio"},{"ingrediente":"Parmigiano grattugiato","qta":"per servire"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio con la pancetta.","Sbuccia le patate e tagliale a tocchetti, uniscile al soffritto.","Aggiungi il concentrato, sala.","Copri con acqua e cuoci 20-25 minuti, finché le patate iniziano a disfarsi.","Aggiungi la pasta direttamente nella pentola, con acqua se serve.","Cuoci fino a cottura della pasta, mescolando spesso.","Servi con parmigiano e un filo d'olio."],"avanzi":"Buona anche il giorno dopo, si addensa: aggiungi acqua per riscaldarla.","freezer":"Non indicata.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/pasta-e-patate-la-ricetta-napoletana/"},"Pasta e zucca":{"porzioni":"3 porzioni","tempo":"40–45 minuti","ingredienti":[{"ingrediente":"Pasta corta","qta":"200 g"},{"ingrediente":"Zucca","qta":"500 g di polpa"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Brodo vegetale o acqua","qta":"circa 800 ml"},{"ingrediente":"Parmigiano grattugiato","qta":"per servire"},{"ingrediente":"Rosmarino","qta":"facoltativo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita carota, sedano e cipolla, falli soffriggere in olio.","Taglia la zucca a cubetti e uniscila al soffritto, con il rosmarino se lo usi.","Copri con brodo caldo e cuoci 20 minuti, finché la zucca inizia a sfaldarsi.","Aggiungi la pasta direttamente nella pentola, con altro brodo se serve.","Cuoci fino a cottura della pasta, mescolando spesso per far amalgamare la zucca.","Servi con parmigiano e un filo d'olio."],"avanzi":"Buona anche il giorno dopo.","freezer":"Non indicata.","ricordare":"","link":"https://www.cookist.it/vellutata-di-zucca-la-ricetta/"},"Scaloppine al limone":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Fettine di vitello","qta":"500 g"},{"ingrediente":"Farina","qta":"per infarinare"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Passa le fettine nella farina, scuotendo l'eccesso.","Scalda olio e burro in padella, rosola le fettine 1-2 minuti per lato.","Sala, sfuma con il succo di limone diluito con un po' d'acqua.","Fai restringere il sughetto qualche minuto.","Completa con prezzemolo fresco e scorza di limone grattugiata."],"avanzi":"Meglio fresche.","freezer":"Non adatte.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/scaloppine-al-limone/"},"Pollo al forno con patate e rosmarino":{"porzioni":"3 porzioni","tempo":"1 ora","ingredienti":[{"ingrediente":"Pollo a pezzi (cosce o sovracosce)","qta":"800 g"},{"ingrediente":"Patate","qta":"600 g"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Rosmarino","qta":"abbondante"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sbuccia le patate e tagliale a spicchi.","Disponi pollo e patate in una teglia, condisci con olio, aglio, rosmarino, sale e pepe.","Mescola bene per distribuire il condimento.","Cuoci in forno già caldo a 200°C per 45-50 minuti, girando a metà cottura, finché dorati."],"avanzi":"Buono anche il giorno dopo.","freezer":"Non indicato.","ricordare":"","link":"https://www.agrodolce.it/ricette/pollo-al-forno-con-rosmarino-e-patate"},"Arista o arrosto di maiale al latte":{"porzioni":"4 porzioni","tempo":"1 ora e 30 minuti","ingredienti":[{"ingrediente":"Arista o lonza di maiale","qta":"800 g"},{"ingrediente":"Latte","qta":"500 ml"},{"ingrediente":"Cipolla","qta":"1"},{"ingrediente":"Rosmarino","qta":"q.b."},{"ingrediente":"Salvia","qta":"q.b."},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lega la carne con spago da cucina se necessario.","Scalda l'olio in una casseruola e rosola la carne su tutti i lati.","Aggiungi la cipolla tritata, rosmarino e salvia.","Sfuma con il vino, lascia evaporare.","Versa il latte, copri e cuoci a fuoco basso circa 1 ora, girando la carne ogni tanto.","Togli la carne, affettala e frulla il fondo di cottura per ottenere una salsa cremosa.","Servi le fette con la salsa."],"avanzi":"Ottima anche il giorno dopo.","freezer":"Si può congelare.","ricordare":"","link":"https://www.cookist.it/arista-di-maiale-al-latte-ricetta/"},"Brasato al vino rosso":{"porzioni":"4 porzioni","tempo":"4 ore (+ marinatura una notte)","ingredienti":[{"ingrediente":"Manzo per brasato (muscolo o cappello del prete)","qta":"800 g"},{"ingrediente":"Vino rosso corposo","qta":"circa 750 ml"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Alloro","qta":"1-2 foglie"},{"ingrediente":"Chiodi di garofano","qta":"2"},{"ingrediente":"Farina","qta":"per infarinare"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Metti la carne in una ciotola con carota, sedano, cipolla a pezzi, alloro e pepe in grani.","Copri con il vino e lascia marinare in frigo per una notte.","Scola la carne (tieni da parte marinata e verdure), asciugala e infarinala leggermente.","Rosola la carne in olio caldo su tutti i lati.","Aggiungi le verdure della marinata e fai insaporire.","Versa il vino della marinata filtrato, aggiungi chiodi di garofano.","Copri e cuoci a fuoco basso per circa 3 ore, finché la carne è tenera.","Affetta la carne e frulla il fondo di cottura per la salsa."],"avanzi":"Ottimo anche il giorno dopo, il sapore migliora riposando.","freezer":"Si può congelare.","ricordare":"Richiede una marinatura di una notte intera prima della cottura.","link":"https://www.eataly.net/it_it/magazine/ricette/ricetta-originale-brasato"},"Polpette al forno":{"porzioni":"3 porzioni","tempo":"45 minuti","ingredienti":[{"ingrediente":"Carne macinata mista","qta":"400 g"},{"ingrediente":"Pane raffermo","qta":"50 g"},{"ingrediente":"Latte","qta":"q.b. per ammollare il pane"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Pangrattato","qta":"per la panatura"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Ammolla il pane nel latte, poi strizzalo e sbriciolalo.","Unisci carne, pane, uovo, parmigiano, prezzemolo, sale e pepe.","Amalgama bene e forma delle polpette.","Passale nel pangrattato, premendo bene.","Disponile su una teglia foderata, distanziate, con un filo d'olio.","Cuoci in forno già caldo a 200°C per 25 minuti, finché dorate."],"avanzi":"Meglio fresche, tendono ad asciugarsi il giorno dopo.","freezer":"Si possono congelare crude.","ricordare":"","link":"https://www.agrodolce.it/ricette/polpette-al-forno"},"Peperoni ripieni":{"porzioni":"3 porzioni","tempo":"1 ora","ingredienti":[{"ingrediente":"Peperoni","qta":"3"},{"ingrediente":"Carne macinata mista","qta":"350 g"},{"ingrediente":"Uovo","qta":"1"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Pangrattato","qta":"40 g"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia i peperoni a metà per il lungo, elimina semi e filamenti.","In una ciotola unisci carne, uovo, parmigiano, pangrattato, prezzemolo, sale e pepe.","Farcisci i peperoni con il composto.","Disponili in una teglia con un filo d'olio.","Cuoci in forno già caldo a 180°C per 40-45 minuti, finché i peperoni sono morbidi."],"avanzi":"Buoni anche il giorno dopo, sia caldi che freddi.","freezer":"Si possono congelare, crudi o già cotti.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/peperoni-ripieni/"},"Melanzane ripiene":{"porzioni":"3 porzioni","tempo":"1 ora","ingredienti":[{"ingrediente":"Melanzane","qta":"3"},{"ingrediente":"Passata di pomodoro","qta":"250 g"},{"ingrediente":"Mozzarella","qta":"150 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olive nere","qta":"facoltative, 50 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le melanzane a metà per il lungo, incidi la polpa e cuocile in forno 15 minuti a 200°C.","Scava la polpa con un cucchiaio, lasciando un bordo di circa mezzo centimetro.","Trita la polpa e falla insaporire in padella con olio e aglio.","Aggiungi la passata, sala e cuoci 10 minuti con basilico.","Farcisci le melanzane con il composto.","Distribuisci mozzarella a cubetti e olive, se le usi.","Cuoci in forno a 200°C per altri 15-20 minuti, finché filanti e dorate."],"avanzi":"Buone anche il giorno dopo.","freezer":"Si possono congelare dopo la cottura.","ricordare":"","link":"https://www.tavolartegusto.it/ricetta/ricetta-melanzane-ripiene/"},"Carciofi alla romana":{"porzioni":"3 porzioni","tempo":"40 minuti","ingredienti":[{"ingrediente":"Carciofi grandi (mammole)","qta":"4"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Prezzemolo","qta":"abbondante"},{"ingrediente":"Mentuccia (o menta)","qta":"q.b."},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Olio EVO","qta":"abbondante"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Prepara una ciotola con acqua e succo di limone.","Pulisci i carciofi eliminando le foglie esterne dure e la punta, svuota l'interno dalla barbetta.","Man mano che li pulisci, immergili nell'acqua acidulata.","Trita aglio, prezzemolo e mentuccia, farcisci l'interno di ogni carciofo con il trito.","Disponi i carciofi capovolti (testa in giù) in un tegame stretto, ben accostati.","Aggiungi olio abbondante, sale, pepe e un po' d'acqua fino a metà altezza dei carciofi.","Copri e cuoci a fuoco basso 30-35 minuti, finché teneri."],"avanzi":"Buoni anche il giorno dopo, a temperatura ambiente.","freezer":"Non indicati.","ricordare":"","link":"https://www.fattoincasadabenedetta.it/ricetta/carciofi-alla-romana/"},"Gateau di patate":{"porzioni":"4 porzioni","tempo":"1 ora","ingredienti":[{"ingrediente":"Patate","qta":"1 kg"},{"ingrediente":"Uova","qta":"2"},{"ingrediente":"Latte","qta":"100 ml"},{"ingrediente":"Burro","qta":"40 g"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Prosciutto cotto","qta":"120 g"},{"ingrediente":"Mozzarella o provola","qta":"200 g"},{"ingrediente":"Pangrattato","qta":"per la teglia"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lessa le patate con la buccia, scolale e schiacciale ancora calde.","Aggiungi burro, latte, uova, parmigiano, sale, pepe e noce moscata, mescola bene.","Scola bene la mozzarella e tagliala a cubetti insieme al prosciutto.","Unisci prosciutto e mozzarella al composto di patate.","Imburra una teglia e cospargila di pangrattato.","Versa il composto, livella e cospargi la superficie con altro pangrattato.","Cuoci in forno già caldo a 180°C per 30-35 minuti, finché dorato in superficie."],"avanzi":"Buono anche il giorno dopo, si riscalda in forno.","freezer":"Si può congelare, meglio crudo prima della cottura.","ricordare":"","link":"https://www.dissapore.com/ricette/gateau-di-patate-napoletano/"},"Sformato di verdure e formaggio":{"porzioni":"3 porzioni","tempo":"50 minuti","ingredienti":[{"ingrediente":"Verdure miste (zucchine, carote, spinaci)","qta":"circa 500 g"},{"ingrediente":"Uova","qta":"4"},{"ingrediente":"Latte","qta":"100 ml"},{"ingrediente":"Formaggio grattugiato","qta":"60 g"},{"ingrediente":"Formaggio filante a cubetti","qta":"100 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava e taglia le verdure a pezzetti piccoli.","Saltale in padella con un filo d'olio finché morbide, salando.","Sbatti le uova con latte, formaggio grattugiato, sale e pepe.","Unisci le verdure intiepidite e il formaggio filante a cubetti.","Versa in una teglia foderata con carta forno.","Cuoci in forno già caldo a 180°C per 30-35 minuti, finché dorato e sodo al centro."],"avanzi":"Buono anche freddo, ottimo per il pranzo.","freezer":"Si può congelare già porzionato.","ricordare":"","link":"https://www.finedininglovers.it/esplora/ricette/frittata-al-forno-con-verdure"},"Pasta con stracchino e zucchine":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Zucchine","qta":"3"},{"ingrediente":"Stracchino","qta":"150 g"},{"ingrediente":"Scalogno piccolo","qta":"1"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."},{"ingrediente":"Parmigiano grattugiato","qta":"facoltativo"}],"procedimento":["Taglia le zucchine a rondelle sottili o a dadini.","Cuocile in padella con lo scalogno tritato e un filo d'olio per 10-15 minuti, finché appassiscono.","Cuoci la pasta in abbondante acqua salata.","Scolala nella padella con le zucchine, tenendo da parte un mestolino di acqua di cottura.","Spegni il fuoco e aggiungi lo stracchino a pezzetti, mantecando finché non si scioglie (allunga con l'acqua di cottura se serve).","Completa con pepe e, se vuoi, una spolverata di parmigiano."],"avanzi":"Sì, ma consumali il prima possibile: lo stracchino ricotto tende a diventare gommoso.","freezer":"Sconsigliato: lo stracchino cambia consistenza da scongelato.","ricordare":"","link":"https://blog.giallozafferano.it/lebistro/pasta-con-zucchine-e-stracchino/"},"Pollo alla senape":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Petto di pollo","qta":"450 g (3 fette)"},{"ingrediente":"Farina","qta":"1 cucchiaio"},{"ingrediente":"Senape di Digione","qta":"2 cucchiai"},{"ingrediente":"Senape in grani","qta":"1 cucchiaio"},{"ingrediente":"Miele","qta":"1 cucchiaio"},{"ingrediente":"Panna da cucina","qta":"100 ml"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia il petto di pollo a fette e infarinale leggermente.","Scalda un filo d'olio in padella e rosola il pollo 2-3 minuti per lato, poi mettilo da parte.","Nella stessa padella unisci senape di Digione, senape in grani e miele con un goccio di acqua.","Aggiungi la panna e fai addensare leggermente la salsa a fuoco basso.","Rimetti il pollo in padella e lascialo insaporire nella salsa per 8-10 minuti, girandolo.","Aggiusta di sale e pepe e servi caldo."],"avanzi":"Sì, buono anche riscaldato.","freezer":"Sì, congela bene insieme alla salsa.","ricordare":"","link":"https://www.cookist.it/pollo-alla-senape-ricetta/"},"Pollo alla piastra":{"porzioni":"3 porzioni","tempo":"20–25 minuti + marinatura","ingredienti":[{"ingrediente":"Petto di pollo","qta":"450 g (3 fette)"},{"ingrediente":"Limone","qta":"1 (succo e scorza)"},{"ingrediente":"Rosmarino","qta":"1 rametto"},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo"},{"ingrediente":"Olio EVO","qta":"2 cucchiai"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Incidi leggermente le fette di pollo così la marinatura penetra meglio.","Mescola olio, succo e scorza di limone, rosmarino tritato, aglio schiacciato, sale e pepe.","Lascia insaporire il pollo nella marinata 15-30 minuti (va bene anche più a lungo se hai tempo).","Scalda bene una piastra o padella antiaderente.","Cuoci il pollo 4-5 minuti per lato, finché è dorato fuori e cotto dentro.","Servi caldo, volendo con altro limone fresco."],"avanzi":"Sì, ottimo anche freddo, per esempio a fettine su un’insalata.","freezer":"Non adatta, meglio cucinarla fresca.","ricordare":"","link":"https://www.cookist.it/pollo-alla-piastra-la-ricetta/"},"Scaloppine ai funghi":{"porzioni":"3 porzioni","tempo":"30–35 minuti","ingredienti":[{"ingrediente":"Fettine di vitello","qta":"450 g"},{"ingrediente":"Funghi champignon","qta":"300 g"},{"ingrediente":"Farina","qta":"30 g"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere, facoltativo"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Passa le fettine di vitello nella farina, scuotendo quella in eccesso.","Sciogli il burro con un filo d'olio in padella e rosola le scaloppine 2-3 minuti per lato, poi mettile da parte.","Nella stessa padella fai dorare l’aglio, aggiungi i funghi puliti e affettati e cuocili 6-8 minuti.","Sfuma con il vino bianco, se lo usi, e lascia evaporare.","Rimetti le scaloppine in padella insieme ai funghi e fai insaporire un paio di minuti.","Completa con prezzemolo tritato, sale e pepe."],"avanzi":"Sì, ma la carne è più buona appena fatta.","freezer":"Non adatta.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/scaloppine-ai-funghi/"},"Straccetti di manzo rucola e grana":{"porzioni":"3 porzioni","tempo":"15–20 minuti","ingredienti":[{"ingrediente":"Straccetti di manzo","qta":"450 g"},{"ingrediente":"Rucola","qta":"80 g"},{"ingrediente":"Grana o parmigiano a scaglie","qta":"60 g"},{"ingrediente":"Limone","qta":"succo di mezzo"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Scalda bene una padella antiaderente, senza olio.","Cuoci gli straccetti pochi minuti a fuoco vivace, girandoli, finché rosolati ma ancora morbidi.","Sala a fine cottura e trasferiscili su un piatto.","Condisci la rucola con un filo d’olio, succo di limone e un pizzico di sale.","Componi il piatto con gli straccetti caldi, la rucola condita sopra e le scaglie di grana.","Completa con una macinata di pepe."],"avanzi":"Sì, ma meglio la carne ancora tiepida, non fredda di frigo.","freezer":"Non adatta.","ricordare":"","link":"https://www.lacucinaimperfetta.com/straccetti-di-manzo-con-la-rucola/"},"Salsiccia al forno con patate e peperoni":{"porzioni":"3 porzioni","tempo":"45–50 minuti","ingredienti":[{"ingrediente":"Salsiccia","qta":"500 g"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Peperoni","qta":"2"},{"ingrediente":"Aglio","qta":"1-2 spicchi"},{"ingrediente":"Rosmarino","qta":"qualche rametto"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Taglia le patate a spicchi o tocchetti e i peperoni a listarelle.","Disponili in una teglia con olio, aglio in camicia, rosmarino, sale e pepe.","Adagia sopra la salsiccia, intera o a pezzi.","Inforna a 200°C per 35-40 minuti, girando a metà cottura.","Se la salsiccia si asciuga troppo prima che le verdure siano cotte, copri la teglia con alluminio.","Sforna quando patate e peperoni sono morbidi e dorati."],"avanzi":"Sì, buona anche il giorno dopo.","freezer":"Sì, si congela bene già cotta.","ricordare":"","link":"https://www.misya.info/ricetta/salsicce-con-peperoni-e-patate.htm"},"Cavolfiore gratinato":{"porzioni":"3 porzioni","tempo":"50–55 minuti","ingredienti":[{"ingrediente":"Cavolfiore","qta":"1 (circa 800 g-1 kg)"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Farina","qta":"30 g"},{"ingrediente":"Latte","qta":"400 ml"},{"ingrediente":"Parmigiano grattugiato","qta":"60 g"},{"ingrediente":"Pangrattato","qta":"2 cucchiai"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Dividi il cavolfiore a cimette e lessalo in acqua salata 7-8 minuti: deve restare un po’ sodo.","Scolalo bene e disponilo in una pirofila da forno.","Prepara la besciamella: sciogli il burro, aggiungi la farina e mescola, poi versa il latte a filo finché si addensa.","Insaporisci la besciamella con sale, pepe e noce moscata.","Versa la besciamella sul cavolfiore, cospargi con parmigiano e pangrattato.","Inforna a 190°C per 30-35 minuti, finché la superficie è dorata."],"avanzi":"Sì, buono anche il giorno dopo.","freezer":"Sì, si può congelare già gratinato.","ricordare":"","link":"https://www.cucchiaio.it/ricetta/cavolfiore-gratinato/"},"Pollo al limone e rosmarino":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Sovracosce di pollo (o petto)","qta":"500–600 g"},{"ingrediente":"Limone","qta":"1"},{"ingrediente":"Rosmarino","qta":"1-2 rametti"},{"ingrediente":"Vino bianco","qta":"facoltativo, per sfumare"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Sala e pepa il pollo e mettilo in padella con olio, rosmarino tritato e limone a fette.","Fai rosolare a fiamma alta un paio di minuti per sigillare la carne.","Abbassa la fiamma e continua la cottura 20-25 minuti, girando di tanto in tanto.","Se vuoi, sfuma con un po’ di vino bianco a metà cottura.","Il pollo è pronto quando la pelle è dorata e la carne cotta internamente.","Servi con il fondo di cottura al limone."],"avanzi":"Sì, buono anche riscaldato.","freezer":"Sì, si congela bene.","ricordare":"","link":"https://blog.giallozafferano.it/lericettediziasimona/pollo-al-limone-e-rosmarino-in-padella/"},"Pasta alla carrettiera":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Pasta","qta":"210 g"},{"ingrediente":"Pomodori maturi (o pomodorini)","qta":"400 g"},{"ingrediente":"Aglio","qta":"1-2 spicchi"},{"ingrediente":"Peperoncino fresco o secco","qta":"q.b."},{"ingrediente":"Basilico","qta":"qualche foglia"},{"ingrediente":"Pecorino grattugiato (o ricotta salata)","qta":"50 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Scotta i pomodori in acqua bollente qualche istante, spellali e taglia a pezzetti (o usa pomodorini a metà).","Trita finemente aglio e peperoncino e mettili in una ciotola capiente con i pomodori.","Aggiungi un pizzico di sale, abbondante olio EVO e il basilico spezzettato, mescola e lascia insaporire.","Cuoci la pasta in acqua bollente salata.","Scolala direttamente nella ciotola con il condimento crudo, unendo un po’ di pecorino e, se serve, acqua di cottura.","Servi con altro pecorino a parte."],"avanzi":"Meglio fresca, il condimento è crudo.","freezer":"Non adatta.","ricordare":"","link":"https://www.dissapore.com/ricette/pasta-alla-carrettiera-ricetta-originale/"},"Spinaci al burro e parmigiano":{"porzioni":"3 porzioni","tempo":"15 minuti","ingredienti":[{"ingrediente":"Spinaci","qta":"500 g"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Parmigiano grattugiato","qta":"40 g"},{"ingrediente":"Aglio","qta":"1 spicchio, facoltativo"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava gli spinaci freschi (o scongela quelli surgelati) e cuocili in pentola coperta, con la sola acqua di lavaggio, 8-10 minuti finché appassiscono.","Scolali bene, strizzandoli leggermente.","Sciogli il burro in padella, volendo con uno spicchio d’aglio da togliere poi.","Aggiungi gli spinaci e falli insaporire un paio di minuti.","Spegni il fuoco e manteca con il parmigiano, mescolando finché si scioglie.","Aggiusta di sale e pepe e servi caldi."],"avanzi":"Sì.","freezer":"Non adatta.","ricordare":"","link":"https://www.galbani.it/ricette/spinaci-burro-e-parmigiano"},"Fagiolini al pomodoro":{"porzioni":"3 porzioni","tempo":"30 minuti","ingredienti":[{"ingrediente":"Fagiolini","qta":"500 g"},{"ingrediente":"Pomodorini (o pelati)","qta":"300 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Basilico","qta":"qualche foglia"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Spunta i fagiolini e lessali in acqua salata 10 minuti: devono restare un po’ croccanti.","Scolali e tienili da parte.","In una padella fai dorare l’aglio con un filo d’olio.","Aggiungi i pomodorini tagliati a metà (o i pelati spezzettati) e cuoci 10 minuti.","Unisci i fagiolini, sala e cuoci altri 5 minuti per far insaporire.","Completa con basilico fresco spezzettato."],"avanzi":"Sì, buoni anche il giorno dopo.","freezer":"Sì, si congelano bene già cotti.","ricordare":"","link":"https://www.misya.info/ricetta/fagiolini-al-pomodoro.htm"},"Straccetti di manzo ai funghi":{"porzioni":"3 porzioni","tempo":"25–30 minuti","ingredienti":[{"ingrediente":"Fesa di manzo a straccetti","qta":"350 g"},{"ingrediente":"Funghi champignon","qta":"250 g"},{"ingrediente":"Aglio","qta":"1 spicchio"},{"ingrediente":"Farina","qta":"q.b."},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Prezzemolo","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Pulisci e affetta i funghi.","Scalda l'olio con l'aglio in padella e rosola i funghi finché sono quasi cotti.","Infarina leggermente gli straccetti, scuotendo via la farina in eccesso.","Alza la fiamma e aggiungi la carne ai funghi.","Sfuma con il vino bianco e lascia evaporare.","Cuoci ancora 5–6 minuti finché la carne è cotta ma morbida.","Regola di sale e pepe e completa con prezzemolo tritato."],"avanzi":"Buona anche il giorno dopo, scaldata in padella.","freezer":"Non ideale: la carne tende a indurirsi.","ricordare":""},"Tagliata di manzo con rucola, grana e pomodorini":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Controfiletto o scamone in un unico pezzo","qta":"500 g"},{"ingrediente":"Rucola","qta":"1 mazzetto"},{"ingrediente":"Pomodorini","qta":"200 g"},{"ingrediente":"Grana o parmigiano a scaglie","qta":"50 g"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Aceto balsamico","qta":"facoltativo"},{"ingrediente":"Sale grosso","qta":"q.b."}],"procedimento":["Togli la carne dal frigo almeno un'ora prima di cuocerla.","Scalda bene una padella o una bistecchiera senza condimento.","Cuoci la carne pochi minuti per lato senza muoverla, finché si stacca da sola.","Non salare durante la cottura: il sale indurisce la carne.","Lascia riposare la carne qualche minuto avvolta in un foglio di alluminio.","Affetta la carne contro fibra a listarelle.","Disponi rucola e pomodorini tagliati a metà su un piatto.","Adagia le fette di carne, sala in superficie e completa con scaglie di grana e un filo d'olio (e balsamico se piace)."],"avanzi":"Meglio consumarla fresca, la carne perde morbidezza da fredda.","freezer":"No.","ricordare":"Tirare fuori la carne dal frigo con anticipo."},"Salsiccia e friarielli":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Friarielli (cime di rapa napoletane)","qta":"500 g"},{"ingrediente":"Salsiccia di maiale","qta":"400 g"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Peperoncino fresco","qta":"facoltativo"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Pulisci i friarielli eliminando i gambi più duri.","Scalda l'olio in una padella larga con l'aglio in camicia e il peperoncino.","Aggiungi i friarielli, sala leggermente, copri e stufa a fuoco basso per 15 minuti.","In un'altra padella rosola la salsiccia intera o a pezzi su tutti i lati.","Sfuma la salsiccia con il vino bianco e lascia evaporare.","Unisci la salsiccia ai friarielli e cuoci insieme altri 10 minuti."],"avanzi":"Sì, anche il giorno dopo.","freezer":"I friarielli si congelano bene, la salsiccia meno.","ricordare":""},"Zucchine alla scapece":{"porzioni":"3 porzioni","tempo":"30 minuti + 2 ore di riposo","ingredienti":[{"ingrediente":"Zucchine","qta":"600 g"},{"ingrediente":"Aglio","qta":"2 spicchi"},{"ingrediente":"Aceto di vino bianco","qta":"4 cucchiai"},{"ingrediente":"Menta fresca","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Olio per friggere","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Taglia le zucchine a fette sottili (3–4 mm).","Stendile su un canovaccio e lasciale asciugare mezz'ora.","Friggile poche alla volta in olio caldo finché dorate, poi scolale su carta assorbente.","Prepara la marinata mescolando olio EVO, aceto, aglio affettato, menta spezzettata e sale.","Disponi le zucchine ancora calde a strati in un contenitore, condendo ogni strato con la marinata.","Lascia riposare almeno un paio d'ore prima di servire."],"avanzi":"Ottima anche il giorno dopo, il sapore migliora col riposo.","freezer":"No.","ricordare":"Va preparata con un po' di anticipo per il riposo."},"Bietole gratinate":{"porzioni":"3 porzioni","tempo":"40 minuti","ingredienti":[{"ingrediente":"Bietole","qta":"800 g"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Farina","qta":"30 g"},{"ingrediente":"Latte","qta":"300 ml"},{"ingrediente":"Noce moscata","qta":"q.b."},{"ingrediente":"Pangrattato","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Lava le bietole e separa coste e foglie.","Lessa prima le coste a tocchetti per 10 minuti, poi le foglie per altri 10 minuti; scola bene.","Prepara la besciamella: sciogli il burro, unisci la farina e mescola un paio di minuti.","Versa il latte a filo mescolando finché la besciamella si addensa, poi insaporisci con sale, pepe e noce moscata.","Unisci le bietole scolate alla besciamella e amalgama.","Versa il composto in una pirofila imburrata, copri con pangrattato e qualche fiocchetto di burro.","Inforna a 200°C per circa 20–25 minuti, finché si forma una crosticina dorata."],"avanzi":"Sì, si scalda bene in forno.","freezer":"Sì, da cotta.","ricordare":""},"Piselli al prosciutto":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Piselli (surgelati o già lessati)","qta":"400 g"},{"ingrediente":"Prosciutto cotto","qta":"150 g"},{"ingrediente":"Cipolla","qta":"mezza"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita finemente la cipolla e falla appassire in padella con un filo d'olio.","Aggiungi i piselli e un goccio d'acqua, copri e cuoci a fuoco basso per 10 minuti.","Unisci il prosciutto a cubetti e cuoci ancora 5 minuti, mescolando.","Regola di sale e pepe prima di servire."],"avanzi":"Sì, ottimo il giorno dopo.","freezer":"Sì, si congela bene.","ricordare":""},"Pasta con patate":{"porzioni":"3 porzioni","tempo":"40 minuti","ingredienti":[{"ingrediente":"Pasta mista (o corta)","qta":"250 g"},{"ingrediente":"Patate","qta":"500 g"},{"ingrediente":"Guanciale o pancetta","qta":"80 g"},{"ingrediente":"Sedano","qta":"1 pezzo"},{"ingrediente":"Carota","qta":"1 pezzo"},{"ingrediente":"Cipolla","qta":"1 pezzo"},{"ingrediente":"Concentrato di pomodoro","qta":"1 cucchiaio"},{"ingrediente":"Crosta di parmigiano","qta":"facoltativa"},{"ingrediente":"Provola a cubetti","qta":"facoltativa"},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita sedano, carota e cipolla e falli soffriggere in olio con il guanciale.","Aggiungi il concentrato di pomodoro e fai insaporire un minuto.","Unisci le patate tagliate a tocchetti e mescola.","Copri con acqua calda fino a superare le patate, aggiungi la crosta di parmigiano se disponibile.","Porta a bollore, poi cuoci a fuoco basso e coperto per 15–20 minuti finché le patate iniziano a disfarsi.","Aggiungi la pasta direttamente nella pentola e cuoci finché al dente, aggiungendo acqua se serve.","Spegni, manteca con la provola a cubetti se la usi e lascia riposare un minuto prima di servire."],"avanzi":"Sì, si addensa ma resta buona.","freezer":"No, meglio fresca.","ricordare":""},"Pasta con ricotta e pomodoro":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Pasta corta","qta":"220 g"},{"ingrediente":"Ricotta","qta":"250 g"},{"ingrediente":"Passata di pomodoro","qta":"300 g"},{"ingrediente":"Scalogno (o cipolla)","qta":"mezzo"},{"ingrediente":"Basilico","qta":"q.b."},{"ingrediente":"Olio EVO","qta":"q.b."},{"ingrediente":"Parmigiano grattugiato","qta":"q.b."},{"ingrediente":"Sale","qta":"q.b."}],"procedimento":["Trita lo scalogno e falla appassire in un tegame con un filo d'olio.","Aggiungi la passata, sala e cuoci 10–15 minuti a fuoco medio.","In una ciotola stempera la ricotta con un paio di cucchiai di acqua di cottura della pasta e un pizzico di sale.","Cuoci la pasta al dente e scolala tenendo da parte l'acqua di cottura.","Manteca la pasta con il sugo di pomodoro e la crema di ricotta, allungando con acqua di cottura se serve.","Completa con basilico spezzettato e parmigiano."],"avanzi":"Da consumare preferibilmente in giornata, la ricotta perde cremosità da fredda.","freezer":"No.","ricordare":""},"Risotto salsiccia e rosmarino":{"porzioni":"3 porzioni","tempo":"35–40 minuti","ingredienti":[{"ingrediente":"Riso Carnaroli","qta":"240 g"},{"ingrediente":"Salsiccia","qta":"200 g"},{"ingrediente":"Rosmarino","qta":"1 rametto"},{"ingrediente":"Cipolla","qta":"mezza"},{"ingrediente":"Vino bianco","qta":"mezzo bicchiere"},{"ingrediente":"Burro","qta":"30 g"},{"ingrediente":"Parmigiano grattugiato","qta":"30 g"},{"ingrediente":"Brodo vegetale","qta":"1 litro circa"},{"ingrediente":"Olio EVO","qta":"q.b."}],"procedimento":["Prepara il brodo vegetale e tienilo caldo.","Trita la cipolla e falla appassire in olio con un po' di rosmarino tritato.","Sbriciola la salsiccia e falla rosolare nel soffritto per qualche minuto.","Versa il riso e tostalo un paio di minuti mescolando.","Sfuma con il vino bianco e lascia evaporare.","Cuoci aggiungendo il brodo caldo un mestolo alla volta per 15–17 minuti, mescolando spesso.","A fine cottura spegni il fuoco e manteca con burro e parmigiano.","Completa con una macinata di pepe e rosmarino fresco."],"avanzi":"Sì, si scalda bene aggiungendo un po' di brodo.","freezer":"Non ideale, il riso perde consistenza.","ricordare":""},"Gnocchi gorgonzola e noci":{"porzioni":"3 porzioni","tempo":"20 minuti","ingredienti":[{"ingrediente":"Gnocchi di patate","qta":"500 g"},{"ingrediente":"Gorgonzola","qta":"200 g"},{"ingrediente":"Latte","qta":"100 ml"},{"ingrediente":"Noci sgusciate","qta":"50 g"},{"ingrediente":"Sale","qta":"q.b."},{"ingrediente":"Pepe","qta":"q.b."}],"procedimento":["Trita grossolanamente le noci.","Scalda il latte in un tegame con il gorgonzola a pezzi, mescolando finché si scioglie in una crema liscia.","Regola di sale e pepe.","Cuoci gli gnocchi in acqua bollente salata finché vengono a galla.","Scolali e saltali un minuto nel tegame con la crema di gorgonzola.","Completa con le noci tritate prima di servire."],"avanzi":"Da consumare preferibilmente subito, la crema tende a rapprendersi.","freezer":"No.","ricordare":""}},"forcedWeekBaseline":{"0":"Pasta tonno e limone","1":"Prosciutto e melone","2":"Salmone con zucchine","3":"Pasta fredda","4":"Melanzane alla pizzaiola","5":"Spiedini con patate","6":"Uova al tegamino con pomodoro"},"forcedWeekVersion":"week-2026-08-29-v2"};

const CAT_COLOR = {
  'pasta':'var(--sage)', 'riso':'var(--amber)', 'carne':'var(--tomato)', 'pesce':'var(--steel)',
  'legumi':'var(--gold-dark)', 'uova':'var(--amber)', 'verdure':'var(--green-mid)', 'forno':'var(--plum)'
};
function catColor(cat){ return CAT_COLOR[cat] || 'var(--sage)'; }

const CAT_LABEL = {
  'pasta':'Pasta / primi', 'riso':'Riso / risotti / polenta / gnocchi', 'carne':'Carne', 'pesce':'Pesce',
  'legumi':'Legumi', 'uova':'Uova', 'verdure':'Verdure protagoniste / vegetariano', 'forno':'Piatti da forno / rustici / piatti unici'
};
const CAT_ICON = {
  'pasta':'🍝', 'riso':'🍚', 'carne':'🥩', 'pesce':'🐟', 'legumi':'🫘', 'uova':'🥚', 'verdure':'🥦', 'forno':'🥧'
};
function catIcon(cat){ return CAT_ICON[cat] || '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg>'; }
const CAT_ORDER = ['pasta','riso','carne','pesce','legumi','uova','verdure','forno'];

const TEMPO_LABEL = { 'express':'⚡ Express — fino a 20 min', 'veloce':'🟢 Veloce — 20–30 min', 'normale':'🟡 Normale — 30–45 min', 'lunga':'🟠 Lunga — 45–90 min', 'progetto':'🔴 Progetto — oltre 90 min' };
const TEMPO_ORDER = ['express','veloce','normale','lunga','progetto'];

const PIAN_LABEL = { 'nessuna':'Nessuna', 'ammollo':'Ammollo', 'scongelamento':'Scongelamento', 'marinatura':'Marinatura', 'impasto-lievitazione':'Impasto / lievitazione', 'prep-anticipata':'Preparazione anticipata' };
const PIAN_ORDER = ['nessuna','ammollo','scongelamento','marinatura','impasto-lievitazione','prep-anticipata'];

const STAGIONE_LABEL = { 'primavera':'🌸 Primavera', 'estate':'☀️ Estate', 'autunno':'🍂 Autunno', 'inverno':'❄️ Inverno', 'tutto':"🌍 Tutto l'anno" };
const STAGIONE_ORDER = ['primavera','estate','autunno','inverno','tutto'];

const AVANZI_LABEL = { 'ottima':'Ottima per il pranzo dopo', 'buona':'Buona il giorno dopo', 'meglio-fatta':'Meglio appena fatta' };
const AVANZI_ORDER = ['ottima','buona','meglio-fatta'];

const FREEZER_LABEL = { 'non-adatta':'❄️ Non adatta', 'congelabile':'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Si può congelare', 'meal-prep':'🍱 Meal prep', 'base':'🧱 Base congelabile' };
const FREEZER_ORDER = ['congelabile','meal-prep','base'];

const GRAD_LABEL = { 'preferita':'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M240 102c0 70-103.79 126.66-108.21 129a8 8 0 0 1-7.58 0C119.79 228.66 16 172 16 102a62.07 62.07 0 0 1 62-62c20.65 0 38.73 8.88 50 23.89C139.27 48.88 157.35 40 178 40a62.07 62.07 0 0 1 62 62"></path></svg> Preferita', 'ci-piace':'🙂 Ci piace', 'ogni-tanto':'😐 Ogni tanto', 'da-provare':'🧪 Da provare' };
const GRAD_ORDER = ['preferita','ci-piace','ogni-tanto','da-provare'];

const ATTREZZ_LABEL = { 'Padella':'Padella', 'Pentola':'Pentola', 'Forno':'Forno', 'Piastra':'Piastra', 'Moulinex':'Moulinex', 'Frullatore':'Frullatore', 'Fritto':'Fritto' };
const ATTREZZ_ORDER = ['Padella','Pentola','Forno','Piastra','Moulinex','Frullatore','Fritto'];

const DEPT_ORDER = ['verdura','carne','pesce','latticini','uova','pane','legumi','dispensa','surgelati','finiti','altro'];
const DEPT_LABEL = { verdura:'Frutta e verdura', carne:'Carne', pesce:'Pesce', latticini:'Latticini e formaggi', uova:'Uova', pane:'Pane, pasta e farine', legumi:'Legumi e conserve', dispensa:'Dispensa e condimenti', surgelati:'Surgelati', finiti:'Finiti', altro:'Altro' };
const DEPT_ICON = { verdura:'🥦', carne:'🥩', pesce:'🐟', latticini:'🧀', uova:'🥚', pane:'🍞', legumi:'🥫', dispensa:'🫙', surgelati:'❄️', finiti:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M253.76 93A12 12 0 0 0 237 90.24l-9 6.44V80a12 12 0 0 0-12-12H40a12 12 0 0 0-12 12v16.68l-9-6.44a12 12 0 1 0-14 19.52l23 16.42V184a36 36 0 0 0 36 36h128a36 36 0 0 0 36-36v-57.82l23-16.42A12 12 0 0 0 253.76 93M204 184a12 12 0 0 1-12 12H64a12 12 0 0 1-12-12V92h152ZM76 40V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0"></path></svg>', altro:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg>' };

const LUOGO_ORDER = ['dispensa','ripostiglio','frigo','freezer','giardino'];
const LUOGO_LABEL = { dispensa:'Dispensa', ripostiglio:'Ripostiglio', frigo:'Frigo', freezer:'Freezer', giardino:'Giardino' };

// Unità di misura tracciabili per una voce di Dispensa: '' = pezzi/generico
// (comportamento originale, solo presenza/assenza), le altre abilitano il
// confronto quantitativo con quanto richiesto dalla ricetta (vedi pantryStatusFor).
const UNIT_ORDER = ['', 'g', 'kg', 'ml', 'l'];
const UNIT_LABEL = { '':'pezzi/generico', g:'grammi (g)', kg:'chili (kg)', ml:'millilitri (ml)', l:'litri (l)' };
// Passo dello stepper +/- in Dispensa, adeguato all'unità (1g o 1ml alla volta non avrebbe senso).
function qtyStepFor(unit){
  if(unit === 'g' || unit === 'ml') return 50;
  if(unit === 'kg' || unit === 'l') return 0.1;
  return 1;
}
const LUOGO_ICON = { 
  dispensa:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M253.76 93A12 12 0 0 0 237 90.24l-9 6.44V80a12 12 0 0 0-12-12H40a12 12 0 0 0-12 12v16.68l-9-6.44a12 12 0 1 0-14 19.52l23 16.42V184a36 36 0 0 0 36 36h128a36 36 0 0 0 36-36v-57.82l23-16.42A12 12 0 0 0 253.76 93M204 184a12 12 0 0 1-12 12H64a12 12 0 0 1-12-12V92h152ZM76 40V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0m40 0V16a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0"></path></svg>', 
  ripostiglio:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--heroicons" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.875 14.25l1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.3 2.3 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.3 2.3 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25"></path></svg>', 
  frigo:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5h2v3H8zm0 7h2v5H8zm10-9.99L6 2a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.11-.9-1.99-2-1.99M18 20H6v-9.02h12zm0-11H6V4h12z"></path></svg>', 
  freezer:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg>', 
  giardino:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.42 39.86a12 12 0 0 0-11.28-11.28c-39.6-2.33-74.59 2.34-104 13.87C84 53.48 62.31 70.58 49.39 91.9c-17.62 29.11-17.66 64.45-.45 98.19l-17.43 17.43a12 12 0 0 0 17 17l17.43-17.43c16.74 8.54 33.88 12.85 50.45 12.85a91.3 91.3 0 0 0 47.74-13.3c21.32-12.92 38.42-34.62 49.45-62.75c11.5-29.43 16.17-64.43 13.84-104.03m-75.76 146.22C131.57 198.25 108 199.17 83.94 189l84.54-84.54a12 12 0 1 0-17-17L67 172.06c-10.14-24-9.22-47.63 3-67.72c20.91-34.53 70.54-53.72 134-52.25c1.38 63.44-17.81 113.08-52.34 133.99"></path></svg>' 
};
const DEPT_RULES = [
  ['passata','legumi'], ['pelati','legumi'], ['conserva','legumi'], ['ceci','legumi'], ['fagioli','legumi'], ['lenticchie','legumi'],
  ['salmone','pesce'], ['tonno','pesce'], ['gamber','pesce'], ['merluzzo','pesce'], ['branzino','pesce'], ['acciughe','pesce'], ['pesce','pesce'],
  ['manzo','carne'], ['pollo','carne'], ['maiale','carne'], ['salsiccia','carne'], ['tacchino','carne'], ['vitello','carne'], ['agnello','carne'], ['straccetti','carne'], ['macinato','carne'],
  ['mozzarella','latticini'], ['ricotta','latticini'], ['parmigiano','latticini'], ['formaggio','latticini'], ['grana','latticini'], ['latte','latticini'], ['burro','latticini'], ['yogurt','latticini'], ['stracchino','latticini'], ['provola','latticini'],
  ['uova','uova'], ['uovo','uova'],
  ['pane','pane'], ['farina','pane'], ['pasta','pane'], ['riso','pane'], ['lievito','pane'],
  // Le voci "peperoncino" e "peperon" (stem di peperone/peperoni) vanno controllate
  // prima di "pepe", altrimenti "pepe" le intercetta per prima essendo una sua sottostringa.
  ['peperoncino','dispensa'], ['peperon','verdura'],
  ['sale','dispensa'], ['olio','dispensa'], ['pepe','dispensa'], ['aceto','dispensa'], ['zucchero','dispensa'], ['spezie','dispensa'],
  ['origano','dispensa'], ['rosmarino','dispensa'], ['timo','dispensa'], ['alloro','dispensa'], ['cannella','dispensa'], ['paprika','dispensa'], ['noce moscata','dispensa'],
  ['senape','dispensa'], ['miele','dispensa'], ['pangrattato','dispensa'],
  ['surgelat','surgelati'], ['gelato','surgelati'],
  ['melanzan','verdura'], ['zucchin','verdura'], ['patat','verdura'], ['insalat','verdura'], ['pomodor','verdura'], ['basilico','verdura'], ['frutta','verdura'], ['verdura','verdura'], ['cipolla','verdura'], ['carota','verdura'], ['aglio','verdura'],
];
// "Di solito li hai già" = flag manuale sulla voce di Dispensa (impostato
// all'aggiunta o dalla modifica), indipendente dalla categoria/reparto: prima
// era dedotto dalla categoria "Utility", ma così un ingrediente restava legato
// a un solo reparto anche quando l'abitudine di averlo in casa non c'entrava
// nulla con dove si compra. Un ingrediente mai aggiunto a Dispensa non è
// considerato basilare finché non lo si spunta la prima volta.
function isStaple(ingrediente){
  const it = state.pantryItems[(ingrediente||'').trim().toLowerCase()];
  return !!(it && it.staple);
}

// Basilari ("di solito li hai già") raccolti dal menù corrente, uniti per solo
// nome (non nome+quantità: altrimenti lo stesso ingrediente con una qta scritta
// in modo leggermente diverso da una ricetta all'altra compariva due volte).

// Un basilare (staple) parte "confermato" - quindi già spuntato in Spesa, al
// suo posto nella lista normale - se lo si ha già in dispensa; se l'utente ha
// toccato la spunta a mano, quella scelta vince sempre.
function hasPantryStock(ingrediente){
  const it = state.pantryItems[(ingrediente||'').trim().toLowerCase()];
  return !!(it && typeof it.qty === 'number' && it.qty > 0);
}

// Estrae {value, unit} dal primo numero trovato in un testo tipo "300 g",
// "1,5 kg", "1 spicchio" — null se non c'è un numero. unit è tutto ciò che
// segue, minuscolo (può essere vuoto, es. "3").
function parseQtyValue(text){
  if(!text) return null;
  const m = (''+text).trim().match(/^(\d+(?:[.,]\d+)?)\s*([a-zà-ù]*)/i);
  if(!m) return null;
  const value = parseFloat(m[1].replace(',', '.'));
  if(Number.isNaN(value)) return null;
  return { value, unit: (m[2]||'').toLowerCase() };
}

// Converte peso/volume in un'unità base comune (grammi o millilitri) per un
// confronto numerico affidabile. Le altre unità (pezzi, spicchi, cucchiai...)
// non sono normalizzabili in modo sicuro senza inventare equivalenze, quindi
// restano fuori da questo confronto — vedi pantryStatusFor.
const WEIGHT_TO_GRAMS = { g:1, gr:1, grammi:1, grammo:1, kg:1000, kilo:1000, kilogrammo:1000, kilogrammi:1000 };
const VOLUME_TO_ML = { ml:1, millilitri:1, l:1000, lt:1000, litro:1000, litri:1000 };
function toComparableUnit(value, unit){
  const u = (unit||'').toLowerCase();
  if(WEIGHT_TO_GRAMS[u] !== undefined) return { value: value * WEIGHT_TO_GRAMS[u], base:'g' };
  if(VOLUME_TO_ML[u] !== undefined) return { value: value * VOLUME_TO_ML[u], base:'ml' };
  return null;
}

// Stato di un ingrediente rispetto alla Dispensa: 'manca' se assente o a
// quantità zero; 'poco' se in Dispensa ce n'è di meno di quanto richiesto
// (solo quando entrambe le quantità sono in un'unità di peso/volume
// riconosciuta e tracciata sulla voce di Dispensa — vedi UNIT_ORDER);
// altrimenti 'in-casa' (semplice presenza, come prima di avere le unità).
function pantryStatusFor(ingrediente, neededQtaText){
  const key = (ingrediente||'').trim().toLowerCase();
  const it = state.pantryItems[key];
  if(!it || typeof it.qty !== 'number' || it.qty <= 0) return 'manca';
  if(!it.unit) return 'in-casa';
  const have = toComparableUnit(it.qty, it.unit);
  const need = neededQtaText ? parseQtyValue(neededQtaText) : null;
  const needComparable = need ? toComparableUnit(need.value, need.unit) : null;
  if(!have || !needComparable || have.base !== needComparable.base) return 'in-casa';
  return have.value >= needComparable.value ? 'in-casa' : 'poco';
}

function isStapleConfirmed(it){
  const touched = it.keys.some(k => state.shopChecked[k] !== undefined);
  if(touched) return it.keys.every(k => state.shopChecked[k]);
  return hasPantryStock(it.ingrediente);
}

// Estrae il numero di porzioni base da un testo tipo "3 porzioni" o
// "4 porzioni (base per più pasti)": null se non parsabile (nessuno scaling).
function parsePortionsBase(porzioniText){
  const m = (porzioniText||'').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

// Scala ogni numero trovato nel testo per ratio, lasciando invariato il resto
// (q.b., facoltativo, unità di misura, parentesi...). I numeri piccoli e interi
// (es. spicchi, uova — fino a 12) si arrotondano a step di 0.5 per restare
// realistici; il resto (grammi, ml...) si arrotonda all'intero più vicino.
function scaleQtyText(text, ratio){
  if(!text || !ratio || ratio === 1) return text;
  return text.replace(/\d+(?:[.,]\d+)?/g, numStr=>{
    const n = parseFloat(numStr.replace(',', '.'));
    if(Number.isNaN(n)) return numStr;
    let scaled = n * ratio;
    scaled = (Number.isInteger(n) && n <= 12) ? Math.round(scaled*2)/2 : Math.round(scaled);
    return Number.isInteger(scaled) ? String(scaled) : String(scaled.toFixed(1)).replace('.', ',');
  });
}

// Lista ingredienti di una ricetta con pallino IN CASA/SCORTA BASSA/MANCA
// (da pantryStatusFor) e un'azione per mandare solo quelli da comprare in
// Spesa: condivisa da Menù e Prep, così il comportamento resta identico
// ovunque si apra il dettaglio di una ricetta.
// ratio scala le quantità visualizzate (e quelle mandate in Spesa) per un
// eventuale numero di porzioni diverso da quello base — vedi renderDayCard.
function renderIngredientsSection(ing, recipeName, ratio){
  ratio = ratio || 1;
  if(!ing.length) return `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta ancora.</div>`;
  const STATUS_LABEL = { 'in-casa':'In casa', 'poco':'Scorta bassa', 'manca':'Manca' };
  const rows = ing.map(it=>{
    const scaledQta = scaleQtyText(it.qta, ratio);
    const status = pantryStatusFor(it.ingrediente, scaledQta);
    return `<li><span class="ing-list-name">${escapeHtml(it.ingrediente)}</span><span class="ing-status ${status}" title="${escapeAttr(STATUS_LABEL[status])}"></span><span style="color:var(--sage)">${escapeHtml(scaledQta||'')}</span></li>`;
  }).join('');
  const mancanti = ing.filter(it => pantryStatusFor(it.ingrediente, scaleQtyText(it.qta, ratio)) !== 'in-casa');
  const mancantiBtn = mancanti.length
    ? `<div class="button-wrapper"><button class="btn is-chip" data-mancanti-in-spesa="${escapeAttr(recipeName)}" data-mancanti-ratio="${ratio}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Aggiungi ${mancanti.length} ingredient${mancanti.length===1?'e':'i'}</button></div>`
    : '';
  return `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti</div><ul class="ing-list">${rows}</ul>${mancantiBtn}</div>`;
}

// Inventario unico (dispensa/ripostiglio/frigo/freezer distinti solo dal
// campo luogo): le stesse voci vengono anche aggiunte/incrementate in
// automatico quando si spunta un articolo in Spesa. Quantità = un contatore
// numerico (stepper +/- in UI); finché non è impostata (o è 0) la voce non
// compare nell'elenco.
function upsertPantryItem(nome, luogo, amount, staple, unit){
  const trimmedName = (nome||'').trim();
  if(!trimmedName) return;
  const key = trimmedName.toLowerCase();
  const existing = state.pantryItems[key];
  const currentQty = (existing && typeof existing.qty === 'number') ? existing.qty : 0;
  const add = (typeof amount === 'number' && !Number.isNaN(amount)) ? amount : 1;
  const isStapleFlag = staple !== undefined ? !!staple : !!(existing && existing.staple);
  const finalUnit = unit !== undefined ? unit : (existing && existing.unit) || '';
  const newQty = currentQty + add;
  state.pantryItems[key] = {
    nome: trimmedName,
    qty: newQty,
    luogo: (existing && existing.luogo) || luogo || 'dispensa',
    ...((existing && existing.cat) ? { cat: existing.cat } : {}),
    ...(isStapleFlag ? { staple: true } : {}),
    ...(finalUnit ? { unit: finalUnit } : {})
  };
  // Torna in scorta: una volta rifinito serve una nuova conferma esplicita da Spesa.
  if(newQty > 0) delete state.pantryConfirmedShop[key];
}

// Rinominare cambia anche la chiave (derivata dal nome): se il nuovo nome
// coincide con un'altra voce già esistente, le quantità si sommano invece
// di perdersi. Ritorna la chiave da usare dopo la modifica.
// La rinomina si propaga anche agli ingredienti delle ricette (vedi
// getIngredientsFor/ingredientRenames), così un nome unificato in Dispensa
// vale ovunque quell'ingrediente compaia — senza dover editare ogni ricetta.
function renamePantryItem(oldKey, newName){
  const trimmed = (newName||'').trim();
  const existing = state.pantryItems[oldKey];
  if(!trimmed || !existing) return oldKey;
  const newKey = trimmed.toLowerCase();
  if(newKey === oldKey){
    existing.nome = trimmed;
    return oldKey;
  }
  if(state.pantryItems[newKey]){
    state.pantryItems[newKey].qty = (state.pantryItems[newKey].qty || 0) + (existing.qty || 0);
  } else {
    state.pantryItems[newKey] = { nome: trimmed, qty: existing.qty, luogo: existing.luogo, cat: existing.cat };
  }
  delete state.pantryItems[oldKey];
  // redirige anche chi puntava già al vecchio nome, per non spezzare la catena
  for(const k in state.ingredientRenames){
    if((state.ingredientRenames[k]||'').trim().toLowerCase() === oldKey) state.ingredientRenames[k] = trimmed;
  }
  state.ingredientRenames[oldKey] = trimmed;
  return newKey;
}

function classifyDept(ingrediente){
  const s = (ingrediente||'').toLowerCase();
  for(const [kw, dept] of DEPT_RULES){ if(s.includes(kw)) return dept; }
  return 'altro';
}

const recipeByName = {};
DATA.recipes.forEach(r=>{ recipeByName[r.nome] = r; });

// Catalogo + ricette create a mano (state.customRecipes), unite ovunque prima
// si usava solo DATA.recipes: ricerca, suggerimenti di scambio, generazione
// casuale del menù, elenco in Ricette.
function allRecipeMetas(){
  return DATA.recipes.map(r=>r.nome).concat(Object.keys(state.customRecipes)).map(getRecipeMeta).filter(Boolean);
}

// Le modifiche fatte a mano dall'utente (Menù o Prep, sono la stessa modale)
// vivono in state.recipeEdits e si sovrappongono ai dati statici del catalogo,
// oppure a una ricetta creata da zero (state.customRecipes, non presente nel
// catalogo DATA.recipes): così restano sincronizzate ovunque la ricetta
// compaia, senza duplicare nulla. I default coprono solo i campi che il resto
// del codice legge senza controllo di esistenza (liste/filtri).
// Una ricetta "eliminata" (state.hiddenRecipes) sparisce ovunque: DATA.recipes
// è statico e non si può rimuovere davvero, quindi la si nasconde soltanto.
function getRecipeMeta(name){
  if(state.hiddenRecipes[name]) return null;
  const base = recipeByName[name] || state.customRecipes[name];
  if(!base) return null;
  const edit = state.recipeEdits[name];
  return Object.assign({ stagioni:['tutto'], gradimento:'', attrezzatura:[] }, base, edit);
}
function getRecipeDetails(name){
  const base = DATA.recipeDetails[name] || null;
  const edit = state.recipeEdits[name];
  if(!edit) return base;
  return Object.assign({}, base || {}, edit);
}

// Ingredienti "veri" per una ricetta: se è stata modificata a mano uso quelli
// aggiornati, altrimenti quelli curati dal dataset, altrimenti quelli eventualmente
// aggiunti a mano tramite il form rapido. I nomi vengono passati attraverso
// ingredientRenames: rinominare un ingrediente in Dispensa lo aggiorna così ovunque
// compaia nelle ricette, senza toccare i dati statici.
function getIngredientsFor(name){
  const edit = state.recipeEdits[name];
  const det = DATA.recipeDetails[name];
  let list;
  if(edit && edit.ingredienti) list = edit.ingredienti;
  else if(det) list = det.ingredienti;
  else list = state.recipeIngredients[name] || [];
  const renames = state.ingredientRenames;
  if(!renames || !Object.keys(renames).length) return list;
  return list.map(it=>{
    let displayName = it.ingrediente;
    const seen = new Set();
    let key = (displayName||'').trim().toLowerCase();
    while(renames[key] && !seen.has(key)){
      seen.add(key);
      displayName = renames[key];
      key = displayName.trim().toLowerCase();
    }
    return displayName === it.ingrediente ? it : Object.assign({}, it, { ingrediente: displayName });
  });
}

const state = {
  tab: 'menu',
  shopChecked: {},
  shopDismissed: {},
  shopExtras: {},
  shopQty: {},
  shopQtyEditingKey: null,
  shopView: 'giorno',
  addIngModalOpen: false,
  pantryAddModalOpen: false,
  pantryChecked: {},
  pantryItems: {},
  pantrySeeded: false,
  pantryQtyMigrated: false,
  pantryUtilityLuogoMigrated: false,
  pantryView: 'categoria',
  pantryEditingKey: null,
  pantryLuogoPicker: null,
  pantryFinishedOpen: false,
  pantryConfirmedShop: {}, // pantryKey -> true, ingrediente finito "aggiunto alla lista": in Spesa/per reparto esce dal blocco Finiti e si mescola nel suo reparto vero
  pantryEditKey: null,
  weekOverrides: {},
  weekOverridePicked: {},
  weekBaseline: null,
  dayTempoCap: {0:'normale',1:'normale',2:'normale',3:'normale',4:'normale',5:'progetto',6:'progetto'}, // giorno (0=Lun..6=Dom) -> tempoBucket massimo consentito in pickWeekRecipes ('progetto' = nessun limite)
  userColors: { mara:'#e03c1e', ste:'#87282b' }, // colore identità scelto da ciascun utente (profilo in Impostazioni)
  notifDismissed: {}, // dayKey ("weekIdx_i") -> true, promemoria "tocca a te cucinare" già chiuso per quel giorno
  mealsDoneReminderDismissed: {}, // dayKey ("weekIdx_i") -> true, promemoria "ieri hai mangiato X?" già chiuso per quel giorno (senza segnarlo mangiato)
  genSettingsOpen: false,
  extraWeeks: [], // settimane pianificate oltre la prima: [{ baseline:{0..6:nome}, overrides:{}, mealsDone:{} }, ...]
  dayLinks: {}, // giorno "avanzo" -> giorno sorgente, entrambi come chiave "weekIdx_i"
  dayLinkNotes: {}, // giorno "avanzo" -> nota libera (es. "fatta a frittata"), stessa chiave di dayLinks
  dayPortions: {}, // "weekIdx_i" -> numero porzioni scelto per quel giorno (override delle porzioni base della ricetta, es. per ospiti)
  cooks: {}, // chiave "weekIdx_i" -> 'mara' | 'ste', chi cucina quel giorno
  shopAssignees: {}, // reparto -> 'mara' | 'ste' | null, chi se ne occupa alla spesa
  linkPickerOpenDay: null,
  recipeIngredients: JSON.parse(JSON.stringify(DATA.recipeIngredientsInitial)),
  ingredientRenames: {},
  recipeEdits: {},
  recipeEditName: null,
  customRecipes: {}, // nome -> {nome}: ricette create a mano, non presenti nel catalogo DATA.recipes
  hiddenRecipes: {}, // nome -> true: ricette del catalogo "eliminate" (DATA.recipes è statico, quindi si nascondono invece di rimuoverle)
  newRecipeModalOpen: false,
  newRecipeError: '',
  expandedDay: null,
  expandedRecipe: null,
  swapOpenDay: null,
  swapFilters: {},
  mealsDone: {},
  doneModalDay: null,
  doneModalQty: {},
  filtersOpen: false, // { [dayIndex]: {search:'', cat:'same'|'all'} }
  filters: { cat:[], tempo:'', pian:'', stagione:'', avanzi:'', freezer:'', grad:'', attrezz:'', search:'' } // cat è multi-selezione (array), gli altri restano a valore singolo
};

// Le 4 tab vivono anche come "pagine" via anchor (#menu/#spesa/#prep/#dispensa):
// un reload o il tasto indietro del browser restano sulla tab corrente invece
// di tornare sempre a Menù.
const TAB_KEYS = ['menu', 'spesa', 'prep', 'dispensa'];
function tabFromHash(){
  const h = window.location.hash.replace('#', '');
  return TAB_KEYS.includes(h) ? h : 'menu';
}
state.tab = tabFromHash();
window.addEventListener('hashchange', ()=>{
  const next = tabFromHash();
  if(next !== state.tab){ state.tab = next; render(); }
});

// Sincronizzazione condivisa via Firebase Realtime Database: chiunque apra la
// pagina legge/scrive lo stesso stato, con aggiornamenti in tempo reale tra
// dispositivi diversi. Import dinamico per restare in un unico <script> classico.
const firebaseReady = (async ()=>{
  try{
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js");
    const { getDatabase, ref, set: fbSet, onValue } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js");
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js");
    const firebaseConfig = {
      apiKey: "AIzaSyDVlyYgyJ1rTtyitMc3xoNhvBm3HPpC0g8",
      authDomain: "cookpop-c91d6.firebaseapp.com",
      databaseURL: "https://cookpop-c91d6-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "cookpop-c91d6",
      storageBucket: "cookpop-c91d6.firebasestorage.app",
      messagingSenderId: "384434265113",
      appId: "1:384434265113:web:63e745711537a29f885e88"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const stateRef = ref(db, 'quaderno-state');
    window.cookpopSync = {
      save(data){ return fbSet(stateRef, data); },
      onChange(cb){ onValue(stateRef, (snap)=>cb(snap.val())); }
    };
    const auth = getAuth(app);
    window.cookpopAuth = {
      signIn(email, password){ return signInWithEmailAndPassword(auth, email, password); },
      signOut(){ return signOut(auth); },
      onAuthStateChanged(cb){ onAuthStateChanged(auth, cb); }
    };
  }catch(e){
    console.error('Firebase non disponibile: nessuna sincronizzazione tra dispositivi, uso solo il salvataggio locale', e);
  }
})();

// Firebase Realtime Database vieta "." "#" "$" "/" "[" "]" nelle chiavi, ma
// alcuni nomi di ricetta le contengono (es. "Orata/branzino al forno con
// patate", usato come chiave in recipeIngredients): le codifichiamo solo nel
// payload verso Firebase, lasciando invariato il formato locale/JSON.
function fbKeyEncode(k){ return k.replace(/[%.#$\/\[\]]/g, c => '%'+c.charCodeAt(0).toString(16).padStart(2,'0')); }
function fbKeyDecode(k){ return k.replace(/%([0-9a-fA-F]{2})/g, (_,h) => String.fromCharCode(parseInt(h,16))); }
function encodeKeysForFirebase(obj){
  const out = {};
  for(const k in obj) out[fbKeyEncode(k)] = obj[k];
  return out;
}
function decodeKeysFromFirebase(obj){
  const out = {};
  for(const k in obj) out[fbKeyDecode(k)] = obj[k];
  return out;
}

// Mostra il gate di login finché non c'è un utente autenticato; risolve
// subito se Firebase non è raggiungibile (offline: si procede con la sola
// cache locale, coerente col fallback già previsto in loadState/persist).
let loggedInEmail = null;
function waitForAuth(){
  return new Promise((resolve)=>{
    if(!window.cookpopAuth){ resolve(); return; }
    const gate = document.getElementById('login-gate');
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const errorBox = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');
    const logoutBtn = document.getElementById('logout-btn');
    let resolved = false;

    window.cookpopAuth.onAuthStateChanged((user)=>{
      loggedInEmail = user ? user.email : null;
      gate.style.display = user ? 'none' : 'flex';
      if(logoutBtn) logoutBtn.style.display = user ? 'block' : 'none';
      if(user && !resolved){ resolved = true; resolve(); }
    });

    async function doLogin(){
      errorBox.textContent = '';
      submitBtn.disabled = true;
      try{
        await window.cookpopAuth.signIn(emailInput.value.trim(), passInput.value);
      }catch(e){
        errorBox.textContent = 'Email o password non corretti.';
      }
      submitBtn.disabled = false;
    }
    submitBtn.addEventListener('click', doLogin);
    passInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doLogin(); });
    if(logoutBtn) logoutBtn.addEventListener('click', ()=> window.cookpopAuth.signOut());
  });
}

// Chi sta usando l'app ora: dedotto dall'account con cui ha fatto login
// (le due email contengono "mara"/"ste"), non serve più un toggle manuale.
function getCurrentUser(){
  const email = (loggedInEmail || '').toLowerCase();
  if(email.includes('mara')) return 'mara';
  if(email.includes('ste')) return 'ste';
  return null;
}
const COOK_LABEL = { mara:'Mara', ste:'Ste' };
// Tavolozza di colori preimpostati tra cui scegliere il proprio "colore identità"
// (profilo in Impostazioni): solo toni abbastanza scuri/saturi da restare leggibili
// col testo chiaro sopra (--bg) del cook-pill.
const USER_COLOR_PRESETS = ['#e03c1e','#87282b','#c9702e','#b08d2b','#5a7517','#2e7d6b','#546e7a','#7a5a8a'];
function applyUserColors(){
  document.documentElement.style.setProperty('--user-color-mara', state.userColors.mara || '#e03c1e');
  document.documentElement.style.setProperty('--user-color-ste', state.userColors.ste || '#87282b');
}

async function loadState(){
  // Cache locale istantanea (utile a schermo pieno offline o a connessione lenta)
  try{
    const cached = localStorage.getItem('quaderno-state');
    if(cached){
      const saved = JSON.parse(cached);
      Object.assign(state, saved);
      if(saved.recipeIngredients) state.recipeIngredients = saved.recipeIngredients;
    }
  }catch(e){ /* nessuno stato salvato ancora */ }

  await firebaseReady;
  if(!window.cookpopSync) return;

  await new Promise((resolve)=>{
    let done = false;
    window.cookpopSync.onChange((saved)=>{
      if(saved){
        if(saved.recipeIngredients) saved.recipeIngredients = decodeKeysFromFirebase(saved.recipeIngredients);
        if(saved.pantryItems) saved.pantryItems = decodeKeysFromFirebase(saved.pantryItems);
        if(saved.freezerItems) saved.freezerItems = decodeKeysFromFirebase(saved.freezerItems);
        if(saved.ingredientRenames) saved.ingredientRenames = decodeKeysFromFirebase(saved.ingredientRenames);
        if(saved.recipeEdits) saved.recipeEdits = decodeKeysFromFirebase(saved.recipeEdits);
        if(saved.customRecipes) saved.customRecipes = decodeKeysFromFirebase(saved.customRecipes);
        if(saved.hiddenRecipes) saved.hiddenRecipes = decodeKeysFromFirebase(saved.hiddenRecipes);
        Object.assign(state, saved);
        if(saved.recipeIngredients) state.recipeIngredients = saved.recipeIngredients;
        if(saved.pantryItems) state.pantryItems = saved.pantryItems;
        if(saved.freezerItems) state.freezerItems = saved.freezerItems;
        if(saved.ingredientRenames) state.ingredientRenames = saved.ingredientRenames;
        if(saved.recipeEdits) state.recipeEdits = saved.recipeEdits;
        if(saved.customRecipes) state.customRecipes = saved.customRecipes;
        if(saved.hiddenRecipes) state.hiddenRecipes = saved.hiddenRecipes;
        try{ localStorage.setItem('quaderno-state', JSON.stringify(saved)); }catch(e){}
      }
      render();
      if(!done){ done = true; resolve(); }
    });
    setTimeout(()=>{ if(!done){ done = true; resolve(); } }, 2500);
  });
}
let saveTimeout=null;
function persist(){
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async ()=>{
    const payload = {
      shopChecked: state.shopChecked,
      shopDismissed: state.shopDismissed,
      shopExtras: state.shopExtras,
      shopQty: state.shopQty,
      pantryChecked: state.pantryChecked,
      shopView: state.shopView,
      weekOverrides: state.weekOverrides,
      weekOverridePicked: state.weekOverridePicked,
      weekBaseline: state.weekBaseline,
      extraWeeks: state.extraWeeks,
      dayLinks: state.dayLinks,
      dayLinkNotes: state.dayLinkNotes,
      dayPortions: state.dayPortions,
      dayTempoCap: state.dayTempoCap,
      userColors: state.userColors,
      notifDismissed: state.notifDismissed,
      mealsDoneReminderDismissed: state.mealsDoneReminderDismissed,
      pantryConfirmedShop: state.pantryConfirmedShop,
      cooks: state.cooks,
      shopAssignees: state.shopAssignees,
      appliedForcedWeekVersion: state.appliedForcedWeekVersion,
      mealsDone: state.mealsDone,
      recipeIngredients: state.recipeIngredients,
      ingredientRenames: state.ingredientRenames,
      recipeEdits: state.recipeEdits,
      customRecipes: state.customRecipes,
      hiddenRecipes: state.hiddenRecipes,
      pantryItems: state.pantryItems,
      pantrySeeded: state.pantrySeeded,
      pantryQtyMigrated: state.pantryQtyMigrated,
      pantryUtilityLuogoMigrated: state.pantryUtilityLuogoMigrated,
      pantryView: state.pantryView
    };
    try{ localStorage.setItem('quaderno-state', JSON.stringify(payload)); }catch(e){}
    try{
      await firebaseReady;
      if(window.cookpopSync){
        // Firebase rifiuta l'intero salvataggio se un solo campo è undefined
        // (es. appliedForcedWeekVersion prima che venga mai impostato): il
        // giro JSON lo elimina, coerente con come viene già trattato in locale.
        const fbPayload = JSON.parse(JSON.stringify({
          ...payload,
          recipeIngredients: encodeKeysForFirebase(payload.recipeIngredients),
          pantryItems: encodeKeysForFirebase(payload.pantryItems),
          ingredientRenames: encodeKeysForFirebase(payload.ingredientRenames),
          recipeEdits: encodeKeysForFirebase(payload.recipeEdits),
          customRecipes: encodeKeysForFirebase(payload.customRecipes),
          hiddenRecipes: encodeKeysForFirebase(payload.hiddenRecipes)
        }));
        await window.cookpopSync.save(fbPayload);
      }
      const hint = document.querySelector('.save-hint');
      if(hint){ hint.textContent = 'salvato ✓'; setTimeout(()=>{ if(hint) hint.textContent=''; }, 1500); }
    }catch(e){ console.error('Errore salvataggio', e); }
  }, 350);
}

// Settimana 0 = quella "corrente" (DATA.week1 + weekOverrides/weekBaseline/mealsDone
// in cima allo state, come da sempre — invariati per compatibilità con i dati già
// salvati). Settimana N (N>=1) = state.extraWeeks[N-1], una pianificazione aggiuntiva
// creata con "Aggiungi settimana": stessa forma {baseline, overrides, mealsDone}, ma
// senza il foglio originale (DATA.week1) come base, dato che non esiste per definizione.
// Firebase Realtime Database elimina i campi il cui valore è un oggetto vuoto
// ({}): appena una settimana extra viene sincronizzata, "overrides"/"mealsDone"
// (spesso vuoti) possono sparire dal documento salvato. Le funzioni sotto si
// "auto-riparano" ricreandoli al volo se mancano, invece di andare in errore
// leggendo undefined (il bug che rompeva il render di Menù e Spesa).
function weekOverridesRef(weekIdx){
  if(weekIdx === 0) return state.weekOverrides || (state.weekOverrides = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.overrides || (w.overrides = {});
}
function weekBaselineRef(weekIdx){
  if(weekIdx === 0) return state.weekBaseline;
  const w = state.extraWeeks[weekIdx-1];
  return w ? (w.baseline || null) : null;
}
function weekMealsDoneRef(weekIdx){
  if(weekIdx === 0) return state.mealsDone || (state.mealsDone = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.mealsDone || (w.mealsDone = {});
}
// Marca solo i giorni la cui ricetta è stata scelta a mano dal catalogo
// ("Cambia ricetta"), non quelli che l'hanno semplicemente ricevuta scambiando
// il giorno con un altro (drag&drop o pulsante Cambia ricetta usato per uno
// scambio): "↺ Originale" ha senso solo per riportare una scelta dal catalogo,
// non per disfare uno scambio, che riguarda l'intera settimana.
function weekOverridePickedRef(weekIdx){
  if(weekIdx === 0) return state.weekOverridePicked || (state.weekOverridePicked = {});
  const w = state.extraWeeks[weekIdx-1];
  if(!w) return {};
  return w.overridePicked || (w.overridePicked = {});
}
// Un giorno "avanzo" (state.dayLinks) rimanda semplicemente al giorno sorgente
// per nome/meta ricetta: stessa ricetta ovunque venga letta, senza duplicare
// nulla. allPlannedDays() lo esclude dall'aggregazione Spesa (ingredienti già
// contati sul giorno sorgente); il link si rompe da solo se il giorno sorgente
// cambia ricetta (vedi unlinkDaysPointingTo).
function linkedSourceDayKey(weekIdx, i){
  return state.dayLinks[`${weekIdx}_${i}`] || null;
}
function effectiveRecipeName(weekIdx, i){
  const link = linkedSourceDayKey(weekIdx, i);
  if(link){ const [sw,si] = link.split('_'); return effectiveRecipeName(parseInt(sw,10), si); }
  const overrides = weekOverridesRef(weekIdx);
  if(overrides[i]) return overrides[i];
  const baseline = weekBaselineRef(weekIdx);
  if(baseline && baseline[i]) return baseline[i];
  if(weekIdx === 0) return DATA.week1[i].cena;
  return '';
}
// Ricetta "vera" del catalogo per il giorno i della settimana weekIdx: se sostituita
// manualmente è la sostituzione, se fa parte di un menù generato è la ricetta generata,
// altrimenti (solo settimana 0) si prova ad abbinarla al catalogo (catalogMatch).
function effectiveRecipeMeta(weekIdx, i){
  const link = linkedSourceDayKey(weekIdx, i);
  if(link){ const [sw,si] = link.split('_'); return effectiveRecipeMeta(parseInt(sw,10), si); }
  const overrideName = weekOverridesRef(weekIdx)[i];
  if(overrideName) return getRecipeMeta(overrideName);
  const baseline = weekBaselineRef(weekIdx);
  if(baseline && baseline[i]) return getRecipeMeta(baseline[i]);
  if(weekIdx === 0){
    const match = DATA.week1[i].catalogMatch;
    return match ? getRecipeMeta(match) : null;
  }
  return null;
}
function effectiveCategoria(weekIdx, i){
  const rec = effectiveRecipeMeta(weekIdx, i);
  if(rec) return rec.categoriaNew;
  return weekIdx === 0 ? (DATA.week1[i].fallbackCategoria || '') : '';
}

const MONTHS_IT = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const MONTHS_IT_SHORT = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];

// La settimana visualizzata parte dal sabato (giorno della spesa) e finisce
// al venerdì successivo: DATA.week1 resta indicizzato Lun(0)...Dom(6) come
// prima (weekOverrides/weekBaseline/mealsDone usano ancora questi indici),
// qui si cambia solo l'ORDINE con cui i 7 giorni vengono mostrati.
const WEEK_DISPLAY_ORDER = [5,6,0,1,2,3,4];

// Sabato che apre la settimana "corrente" (quella che contiene oggi): se oggi è
// sabato è oggi stesso, altrimenti il sabato appena passato — così la settimana 0
// include sempre la data di oggi ed è possibile evidenziarla nel Menù.
function upcomingSaturday(){
  const today = new Date();
  const day = today.getDay(); // 0=dom, 1=lun ... 6=sab
  const daysSinceSaturday = (day + 1) % 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() - daysSinceSaturday);
  return saturday;
}
// weekIdx-esima settimana a partire da quella corrente (0 = corrente, 1 = successiva, ...)
function weekDatesFor(weekIdx){
  const saturday = upcomingSaturday();
  saturday.setDate(saturday.getDate() + weekIdx*7);
  return WEEK_DISPLAY_ORDER.map((_,pos)=>{
    const d = new Date(saturday);
    d.setDate(saturday.getDate() + pos);
    return d;
  });
}
function formatShortDate(date){
  return `${date.getDate()} ${MONTHS_IT_SHORT[date.getMonth()]}`;
}
function isSameDay(a, b){
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}
function weekLabelFor(weekIdx){
  const dates = weekDatesFor(weekIdx);
  const saturday = dates[0], friday = dates[6];
  const dm = saturday.getDate(), ds = friday.getDate();
  const mm = MONTHS_IT[saturday.getMonth()], ms = MONTHS_IT[friday.getMonth()];
  if(mm === ms) return `${dm}–${ds} ${mm}`;
  return `${dm} ${mm} – ${ds} ${ms}`;
}
// Tutti i giorni pianificati (settimana corrente + eventuali extra), nell'ordine di
// visualizzazione: usato da Spesa per aggregare gli ingredienti di ogni settimana.
// I giorni "avanzo di un altro giorno" sono esclusi: i loro ingredienti sono già
// contati sul giorno sorgente, altrimenti finirebbero comprati due volte.
function allPlannedDays(){
  const days = [];
  const pushWeek = (weekIdx) => {
    const dates = weekDatesFor(weekIdx);
    WEEK_DISPLAY_ORDER.forEach((i,pos)=>{
      if(linkedSourceDayKey(weekIdx, i)) return;
      days.push({
        weekIdx, i,
        giorno: DATA.week1[i].giorno,
        dateLabel: formatShortDate(dates[pos]),
        name: effectiveRecipeName(weekIdx, i)
      });
    });
  };
  pushWeek(0);
  state.extraWeeks.forEach((w,wi)=> pushWeek(wi+1));
  return days;
}
// Prossimo giorno, a partire da oggi, in cui cucina "user": scorre la settimana
// corrente (solo dal giorno di oggi in poi) e le settimane extra già pianificate,
// nello stesso ordine di visualizzazione del Menù. daysFromToday è 0/1 solo per
// la settimana corrente (usato dal promemoria "oggi/domani cucini tu"), altrimenti null.
function nextCookDayFor(user){
  const startPos = findTodayPos() ?? 0;
  const weeksToCheck = [0, ...state.extraWeeks.map((_,wi)=>wi+1)];
  for(const weekIdx of weeksToCheck){
    const dates = weekDatesFor(weekIdx);
    for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++){
      if(weekIdx===0 && pos<startPos) continue;
      const i = WEEK_DISPLAY_ORDER[pos];
      const dayKey = `${weekIdx}_${i}`;
      if(state.cooks[dayKey] === user){
        return {
          dayKey,
          giorno: DATA.week1[i].giorno,
          dateLabel: formatShortDate(dates[pos]),
          name: effectiveRecipeName(weekIdx, i),
          daysFromToday: weekIdx===0 ? (pos - startPos) : null
        };
      }
    }
  }
  return null;
}
// Chiave stabile per un ingrediente di un giorno: invariata per la settimana 0
// (compatibilità con le spunte/dismissioni già salvate), con prefisso di settimana
// per le extra dato che non possono esistere collisioni con le chiavi già in uso.
function dayIngKey(weekIdx, i, idx){
  return weekIdx === 0 ? `d${i}_${idx}` : `d${weekIdx}_${i}_${idx}`;
}

function currentSeasonKey(){
  const m = new Date().getMonth(); // 0=gen ... 11=dic
  if(m >= 2 && m <= 4) return 'primavera';   // mar-mag
  if(m >= 5 && m <= 7) return 'estate';      // giu-ago
  if(m >= 8 && m <= 10) return 'autunno';    // set-nov
  return 'inverno';                          // dic-feb
}

// Sceglie 7 ricette di stagione per una settimana, variando le categorie
// giorno per giorno (da lunedì a venerdì solo ricette fino a 30-45 min).
// Puramente funzionale: non tocca lo state, così è riusabile sia per la
// settimana corrente che per ogni settimana extra aggiunta.
// Al posto di una lunga lista filtrabile, 3 suggerimenti con una motivazione
// esplicita: sotto i 30 minuti nei feriali, progetto/congelabile nel weekend,
// altrimenti una categoria diversa da quella di oggi. i è l'indice originale
// del giorno (0=Lun...6=Dom): 5 e 6 (Sab/Dom) contano come weekend.
function suggestSwaps(weekIdx, i){
  const currentCat = effectiveCategoria(weekIdx, i);
  const inPlan = new Set();
  WEEK_DISPLAY_ORDER.forEach(di => { const n = effectiveRecipeName(weekIdx, di); if(n) inPlan.add(n); });
  const isWeekend = i === 5 || i === 6;
  const WEEKDAY_TEMPO = ['express','veloce','normale'];
  const scored = allRecipeMetas().filter(r => !inPlan.has(r.nome)).map(r=>{
    const isLong = r.tempoBucket === 'progetto' || r.tempoBucket === 'lunga';
    const isFreezable = r.freezerNew === 'congelabile' || r.freezerNew === 'base';
    let motivo;
    if(isWeekend && isLong) motivo = 'Progetto da weekend';
    else if(WEEKDAY_TEMPO.includes(r.tempoBucket)) motivo = 'Sotto i 30–45 minuti';
    else if(isFreezable) motivo = 'Congelabile: doppia porzione';
    else motivo = 'Categoria diversa da oggi';
    let score = isWeekend ? (isLong ? 0 : 2) : (WEEKDAY_TEMPO.includes(r.tempoBucket) ? 0 : 2);
    if(r.categoriaNew === currentCat) score += 1;
    return { r, motivo, score };
  });
  scored.sort((a,b)=> a.score - b.score);
  return scored.slice(0,3);
}

function pickWeekRecipes(){
  const season = currentSeasonKey();
  let pool = allRecipeMetas().filter(r => r.stagioni.includes(season) || r.stagioni.includes('tutto'));
  if(pool.length < 7) pool = allRecipeMetas(); // fallback di sicurezza, non dovrebbe servire

  // mescolo
  const shuffled = pool.slice();
  for(let i = shuffled.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const picked = [];
  const usedNames = new Set();
  const catCount = {};
  let prevCat = null;

  for(let day = 0; day < 7; day++){
    const cap = state.dayTempoCap[day] || 'progetto';
    const capIdx = TEMPO_ORDER.indexOf(cap);
    // candidati non ancora usati, ordinati per preferenza: categoria diversa dal giorno prima
    // e categoria meno usata finora nella settimana
    let candidates = shuffled.filter(r => !usedNames.has(r.nome));
    if(capIdx < TEMPO_ORDER.length - 1){
      const allowed = TEMPO_ORDER.slice(0, capIdx + 1);
      const limited = candidates.filter(r => allowed.includes(r.tempoBucket));
      if(limited.length > 0) candidates = limited; // rispetta il tetto di durata scelto per quel giorno, se disponibili
    }
    if(candidates.length === 0) candidates = shuffled; // esaurito il pool, riparto (raro)

    candidates = candidates.slice().sort((a,b)=>{
      const aSamePrev = a.categoriaNew === prevCat ? 1 : 0;
      const bSamePrev = b.categoriaNew === prevCat ? 1 : 0;
      if(aSamePrev !== bSamePrev) return aSamePrev - bSamePrev; // penalizza stessa categoria di ieri
      const aCount = catCount[a.categoriaNew] || 0;
      const bCount = catCount[b.categoriaNew] || 0;
      return aCount - bCount; // preferisci categoria meno usata
    });

    const chosen = candidates[0];
    picked.push(chosen);
    usedNames.add(chosen.nome);
    catCount[chosen.categoriaNew] = (catCount[chosen.categoriaNew] || 0) + 1;
    prevCat = chosen.categoriaNew;
  }

  return picked;
}

// Genera (o rigenera) la settimana weekIdx: 0 è quella corrente (in cima allo
// state, come sempre), weekIdx>=1 crea/sostituisce state.extraWeeks[weekIdx-1].
// Rimuove ogni collegamento "avanzo di" che punta a dayKey: usata ogni volta
// che la ricetta di un giorno cambia, per non lasciare un giorno "fantasma"
// che continua a mostrare una ricetta di cui in realtà non ci sono più avanzi.
function unlinkDaysPointingTo(dayKey){
  Object.keys(state.dayLinks).forEach(k=>{
    if(state.dayLinks[k] === dayKey) clearDayLink(k);
  });
}
// Rimuove tutto ciò che è specifico della ricetta assegnata a un giorno prima
// che cambi identità (collegamento "avanzo di" + nota variante, e l'eventuale
// override porzioni): altrimenti resterebbero agganciati alla nuova ricetta
// per puro riuso della chiave "weekIdx_i", con effetti confusi (es. porzioni
// scalate per una ricetta diversa da quella per cui erano state impostate).
function clearDayLink(dayKey){
  delete state.dayLinks[dayKey];
  delete state.dayLinkNotes[dayKey];
  delete state.dayPortions[dayKey];
}
// Ciclo nessuno -> mara -> ste -> nessuno, un tap alla volta, senza modali.
function toggleCook(dayKey){
  const cur = state.cooks[dayKey];
  if(!cur) state.cooks[dayKey] = 'mara';
  else if(cur === 'mara') state.cooks[dayKey] = 'ste';
  else delete state.cooks[dayKey];
  persist(); render();
}
function toggleShopAssignee(store){
  const cur = state.shopAssignees[store];
  if(!cur) state.shopAssignees[store] = 'mara';
  else if(cur === 'mara') state.shopAssignees[store] = 'ste';
  else delete state.shopAssignees[store];
  persist(); render();
}
function generateWeek(weekIdx){
  const baseline = {};
  pickWeekRecipes().forEach((r, i) => { baseline[i] = r.nome; });
  if(weekIdx === 0){
    state.weekBaseline = baseline;
    state.weekOverrides = {};
    state.weekOverridePicked = {};
    state.mealsDone = {};
  } else {
    state.extraWeeks[weekIdx-1] = { baseline, overrides:{}, overridePicked:{}, mealsDone:{} };
  }
  for(let i=0;i<7;i++){
    const dayKey = `${weekIdx}_${i}`;
    clearDayLink(dayKey);
    unlinkDaysPointingTo(dayKey);
  }
  state.expandedDay = null;
  state.swapOpenDay = null;
  persist();
  render();
}
function addWeek(){
  generateWeek(state.extraWeeks.length + 1);
}
// Rimuove una settimana extra: le successive scalano di una posizione, ma dato
// che il loro weekIdx è sempre derivato dalla posizione nell'array (mai un id
// fisso salvato altrove) non serve nessuna migrazione.
function removeWeek(weekIdx){
  if(weekIdx === 0) return;
  state.extraWeeks.splice(weekIdx-1, 1);
  state.expandedDay = null;
  state.swapOpenDay = null;
  persist();
  render();
}

// Scambia le ricette di due giorni, anche tra settimane diverse (drag&drop nel
// Menù): entrambi diventano override manuali, coerente con "Cambia ricetta" —
// il "fatta" non ha più senso dopo lo scambio, quindi si azzera per entrambi.
function swapDayRecipes(weekIdxA, i, weekIdxB, j){
  if(weekIdxA === weekIdxB && i === j) return;
  const nameI = effectiveRecipeName(weekIdxA, i);
  const nameJ = effectiveRecipeName(weekIdxB, j);
  const dayKeyA = `${weekIdxA}_${i}`, dayKeyB = `${weekIdxB}_${j}`;
  weekOverridesRef(weekIdxA)[i] = nameJ;
  weekOverridesRef(weekIdxB)[j] = nameI;
  delete weekOverridePickedRef(weekIdxA)[i];
  delete weekOverridePickedRef(weekIdxB)[j];
  delete weekMealsDoneRef(weekIdxA)[i];
  delete weekMealsDoneRef(weekIdxB)[j];
  clearDayLink(dayKeyA);
  clearDayLink(dayKeyB);
  unlinkDaysPointingTo(dayKeyA);
  unlinkDaysPointingTo(dayKeyB);
  state.swapOpenDay = null;
  persist();
  render();
}

function render(){
  document.querySelectorAll('nav.tabs button').forEach(b=>{ b.classList.toggle('active', b.dataset.tab === state.tab); });
  const panel = document.getElementById('panel');
  if(state.tab === 'menu') panel.innerHTML = renderMenu();
  if(state.tab === 'spesa') panel.innerHTML = renderSpesa();
  if(state.tab === 'prep') panel.innerHTML = renderPrep();
  if(state.tab === 'dispensa') panel.innerHTML = renderDispensa();
  attachHandlers();
}

function editIngRowHtml(ingrediente, qta){
  return `
    <div class="edit-ing-row">
      <input type="text" class="edit-ing-name" placeholder="Ingrediente" value="${escapeAttr(ingrediente||'')}">
      <input type="text" class="edit-ing-qta" placeholder="Quantità" value="${escapeAttr(qta||'')}">
      <button type="button" class="btn is-outline is-icon is-danger edit-row-remove" data-remove-row aria-label="Rimuovi riga">✕</button>
    </div>`;
}
function editStepRowHtml(text){
  return `
    <div class="edit-step-row">
      <textarea class="edit-step-text" rows="2" placeholder="Passaggio">${escapeHtml(text||'')}</textarea>
      <button type="button" class="btn is-outline is-icon is-danger edit-row-remove" data-remove-row aria-label="Rimuovi passaggio">✕</button>
    </div>`;
}

// Modale unica "Modifica ricetta", condivisa da Menù e Prep (stessa modale,
// stesso state.recipeEdits): qualsiasi modifica è quindi automaticamente
// visibile in entrambe le tab, non serve tenerle sincronizzate a mano.
function renderRecipeEditModal(){
  if(!state.recipeEditName) return '';
  const name = state.recipeEditName;
  const rec = getRecipeMeta(name);
  const det = getRecipeDetails(name);
  if(!rec) return '';
  const ingredienti = getIngredientsFor(name);
  const procedimento = (det && det.procedimento) || [];
  const stagioniSet = new Set(rec.stagioni || []);

  const ingRowsHtml = (ingredienti.length ? ingredienti : [{ingrediente:'',qta:''}])
    .map(it => editIngRowHtml(it.ingrediente, it.qta)).join('');

  const stepRowsHtml = (procedimento.length ? procedimento : [''])
    .map(s => editStepRowHtml(s)).join('');

  return `
    <div class="filters-modal-backdrop" data-close-recipe-edit>
      <div class="filters-modal recipe-edit-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Modifica ricetta</h3>
          <button class="btn is-icon filters-close-btn" data-close-recipe-edit>✕</button>
        </div>
        <p class="section-sub" style="margin-top:-8px;">${escapeHtml(name)}</p>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo (etichetta mostrata)</div>
            <input type="text" id="edit-tempo" value="${escapeAttr(rec.tempo || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Fascia di tempo (usata per filtrare in Prep)</div>
            <select id="edit-tempo-bucket">
              ${TEMPO_ORDER.map(t=>`<option value="${t}" ${rec.tempoBucket===t?'selected':''}>${escapeHtml(TEMPO_LABEL[t])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Porzioni</div>
            <input type="text" id="edit-porzioni" value="${escapeAttr((det && det.porzioni) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Categoria</div>
            <select id="edit-categoria">
              ${CAT_ORDER.map(c=>`<option value="${c}" ${rec.categoriaNew===c?'selected':''}>${catIcon(c)} ${escapeHtml(CAT_LABEL[c])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3"></path></svg> Stagioni</div>
            <div class="chip-row" id="edit-stagioni">
              ${STAGIONE_ORDER.map(s=>`<button type="button" class="btn is-chip ${stagioniSet.has(s)?'active':''}" data-stagione-chip="${s}">${escapeHtml(STAGIONE_LABEL[s])}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Freezer</div>
            <select id="edit-freezer-new">
              <option value="" ${(!rec.freezerNew || rec.freezerNew==='non-adatta')?'selected':''}>Non congelabile</option>
              ${FREEZER_ORDER.map(f=>`<option value="${f}" ${rec.freezerNew===f?'selected':''}>${escapeHtml(stripHtml(FREEZER_LABEL[f]))}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Avanzi</div>
            <select id="edit-avanzi-new">
              ${AVANZI_ORDER.map(a=>`<option value="${a}" ${rec.avanziNew===a?'selected':''}>${escapeHtml(AVANZI_LABEL[a])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> Pianificazione</div>
            <select id="edit-pianificazione">
              ${PIAN_ORDER.map(p=>`<option value="${p}" ${rec.pianificazione===p?'selected':''}>${escapeHtml(PIAN_LABEL[p])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0m11 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"></path><path d="M17 17H6V3H4"></path><path d="m6 5l14 1l-1 7H6"></path></g></svg> Ingredienti</div>
            <div id="edit-ing-list">${ingRowsHtml}</div>
            <button type="button" class="btn is-chip" id="edit-add-ing-row">+ aggiungi ingrediente</button>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div>
            <div id="edit-step-list">${stepRowsHtml}</div>
            <button type="button" class="btn is-chip" id="edit-add-step-row">+ aggiungi passaggio</button>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Da ricordare</div>
            <input type="text" id="edit-ricordare" value="${escapeAttr((det && det.ricordare) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Nota avanzi</div>
            <input type="text" id="edit-avanzi-note" value="${escapeAttr((det && det.avanzi) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Nota freezer</div>
            <input type="text" id="edit-freezer-note" value="${escapeAttr((det && det.freezer) || '')}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">🔗 Link fonte</div>
            <input type="text" id="edit-link" value="${escapeAttr((det && det.link) || '')}">
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost is-danger reset-btn" id="edit-recipe-delete" data-delete-recipe="${escapeAttr(name)}">Elimina</button>
          <button class="btn is-ghost reset-btn" data-close-recipe-edit>Annulla</button>
          <button class="btn is-solid mini-add-btn" id="edit-recipe-save" data-save-recipe-edit="${escapeAttr(name)}">Salva</button>
        </div>
      </div>
    </div>`;
}

// Un giorno di una qualunque settimana (weekIdx 0 = corrente, >=1 = extra).
// dayKey identifica il giorno in modo univoco tra tutte le settimane mostrate
// insieme, usato per lo state ephemeral (espanso, swap aperto, modale fatta...).
function renderDayCard(weekIdx, i, pos, weekDates){
  const dayKey = `${weekIdx}_${i}`;
  const linkSource = linkedSourceDayKey(weekIdx, i);
  const d = DATA.week1[i];
  const dateLabel = formatShortDate(weekDates[pos]);
  const isToday = isSameDay(weekDates[pos], new Date());
  const name = effectiveRecipeName(weekIdx, i);
  const hasOverride = !!weekOverridesRef(weekIdx)[i];
  // "↺ Originale" ha senso solo dopo una scelta manuale dal catalogo, non dopo
  // uno scambio tra giorni (che riguarda l'intera settimana, non un giorno solo).
  const hasPickedOverride = !!weekOverridePickedRef(weekIdx)[i];
  const isChanged = !!linkSource || weekIdx !== 0 || hasOverride || !!(state.weekBaseline && state.weekBaseline[i]);
  const rec = effectiveRecipeMeta(weekIdx, i); // dati di catalogo, se disponibili
  const currentCat = effectiveCategoria(weekIdx, i);
  let swapPanelHtml = '';
  if(state.swapOpenDay === dayKey){
    const f = state.swapFilters[dayKey] || {search:'', cat: currentCat ? 'same' : 'all'};
    state.swapFilters[dayKey] = f;
    let results = allRecipeMetas();
    if(f.cat === 'same' && currentCat) results = results.filter(r=>r.categoriaNew === currentCat);
    if(f.search) results = results.filter(r=>r.nome.toLowerCase().includes(f.search.toLowerCase()));
    const resultsHtml = results.slice(0, 60).map(r=>`
      <div class="swap-result" data-swap-pick="${escapeAttr(r.nome)}" data-swap-day="${dayKey}">
        <span class="swap-result-icon">${catIcon(r.categoriaNew)}</span>
        <span class="swap-result-name">${escapeHtml(r.nome)}</span>
        <span class="swap-result-time">${escapeHtml(TEMPO_LABEL[r.tempoBucket])}</span>
      </div>`).join('');
    const suggestions = suggestSwaps(weekIdx, i);
    const suggestionsHtml = suggestions.length ? `
      <div class="swap-suggestions">
        <div class="filter-group-label">Suggeriti per questo giorno</div>
        ${suggestions.map(s=>`
          <button type="button" class="btn swap-suggestion" data-swap-pick="${escapeAttr(s.r.nome)}" data-swap-day="${dayKey}">
            <span class="swap-suggestion-top"><span class="swap-suggestion-name">${escapeHtml(s.r.nome)}</span><span class="swap-suggestion-time">${escapeHtml(s.r.tempo)}</span></span>
            <span class="swap-suggestion-motivo">${escapeHtml(s.motivo)}</span>
          </button>`).join('')}
      </div>` : '';
    swapPanelHtml = `
    <div class="swap-panel">
      ${suggestionsHtml}
      <div class="filter-group-label">Oppure cerca</div>
      <input type="search" class="swap-search" placeholder="Cerca ricetta…" data-swap-search="${dayKey}" value="${escapeAttr(f.search)}">
      <div class="swap-cat-chips">
        ${currentCat ? `<button class="btn is-chip ${f.cat==='same'?'active':''}" data-swap-cat="same" data-swap-day="${dayKey}">${catIcon(currentCat)} Stessa categoria</button>` : ''}
        <button class="btn is-chip ${f.cat==='all'?'active':''}" data-swap-cat="all" data-swap-day="${dayKey}">Tutte le categorie</button>
      </div>
      <div class="swap-results">
        ${resultsHtml || '<div class="ing-empty">Nessuna ricetta trovata.</div>'}
        ${results.length > 60 ? `<div class="ing-empty">Altri ${results.length-60} risultati — affina la ricerca.</div>` : ''}
      </div>
    </div>`;
  }
  let linkPanelHtml = '';
  if(state.linkPickerOpenDay === dayKey){
    // Solo i giorni successivi a questo hanno senso come "quando la mangerete":
    // allPlannedDays() è già in ordine cronologico (settimana 0, poi le extra).
    const allDays = allPlannedDays();
    const selfPos = allDays.findIndex(o => `${o.weekIdx}_${o.i}` === dayKey);
    const options = allDays.filter((o, idx) => idx > selfPos);
    const optionsHtml = options.map(o=>`
      <div class="swap-result" data-link-pick="${o.weekIdx}_${o.i}" data-link-day="${dayKey}">
        <span class="swap-result-name">${escapeHtml(o.giorno)} ${escapeHtml(o.dateLabel)}</span>
        <span class="swap-result-time">${escapeHtml(o.name)}</span>
      </div>`).join('');
    linkPanelHtml = `
    <div class="swap-panel">
      <p class="section-sub" style="margin:0 0 8px;">Scegli il giorno in cui la mangerete:</p>
      <div class="swap-results">
        ${optionsHtml || '<div class="ing-empty">Nessun giorno successivo disponibile.</div>'}
      </div>
    </div>`;
  }

  const isDone = !!weekMealsDoneRef(weekIdx)[i];
  let swapControls;
  if(linkSource){
    const [slw, sli] = linkSource.split('_');
    const sourceGiorno = DATA.week1[sli].giorno;
    swapControls = `
    <div class="avanzo-chip"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Avanzo di ${escapeHtml(sourceGiorno)}</div>
    <input type="text" class="avanzo-note-input" placeholder="Variante (facoltativa, es. fatta a frittata)" value="${escapeAttr(state.dayLinkNotes[dayKey] || '')}" data-link-note="${dayKey}">
    <div class="swap-controls">
      <button class="btn is-chip is-eat ${isDone ? 'active' : ''}" data-toggle-done="${dayKey}">${isDone ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Mangiata' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Da mangiare'}</button>
      <button class="btn is-chip" data-unlink-day="${dayKey}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M117.18 188.74a12 12 0 0 1 0 17l-5.12 5.12A58.26 58.26 0 0 1 70.6 228a58.62 58.62 0 0 1-41.46-100.08l34.75-34.75a58.64 58.64 0 0 1 98.56 28.11a12 12 0 1 1-23.37 5.44a34.65 34.65 0 0 0-58.22-16.58l-34.75 34.75A34.62 34.62 0 0 0 70.57 204a34.4 34.4 0 0 0 24.49-10.14l5.11-5.12a12 12 0 0 1 17.01 0M226.83 45.17a58.65 58.65 0 0 0-82.93 0l-5.11 5.11a12 12 0 0 0 17 17l5.12-5.12a34.63 34.63 0 1 1 49 49l-34.81 34.7A34.4 34.4 0 0 1 150.61 156a34.63 34.63 0 0 1-33.69-26.72a12 12 0 0 0-23.38 5.44A58.64 58.64 0 0 0 150.56 180h.05a58.28 58.28 0 0 0 41.47-17.17l34.75-34.75a58.62 58.62 0 0 0 0-82.91"></path></svg> Scollega</button>
    </div>`;
  } else {
    swapControls = `
    <div class="swap-controls">
      <button class="btn is-chip is-eat ${isDone ? 'active' : ''}" data-toggle-done="${dayKey}">${isDone ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Mangiata' : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Da mangiare'}</button>
      <button class="btn is-chip is-dashed" data-open-swap="${dayKey}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 48v48a12 12 0 0 1-12 12h-48a12 12 0 0 1 0-24h19l-7.8-7.8a75.55 75.55 0 0 0-53.32-22.26h-.43a75.5 75.5 0 0 0-53.06 21.63a12 12 0 1 1-16.78-17.16a99.38 99.38 0 0 1 69.87-28.47h.52a99.42 99.42 0 0 1 70.2 29.29L204 67V48a12 12 0 0 1 24 0m-44.39 132.43a75.5 75.5 0 0 1-53.09 21.63h-.43a75.55 75.55 0 0 1-53.32-22.26L69 172h19a12 12 0 0 0 0-24H40a12 12 0 0 0-12 12v48a12 12 0 0 0 24 0v-19l7.8 7.8a99.42 99.42 0 0 0 70.2 29.26h.56a99.38 99.38 0 0 0 69.87-28.47a12 12 0 0 0-16.78-17.16Z"></path></svg> Cambia</button>
      ${hasPickedOverride ? `<button class="btn is-chip is-dashed" data-reset-swap="${dayKey}">↺ Originale</button>` : ''}
      <button class="btn is-chip is-dashed" data-open-link-picker="${dayKey}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> È avanzata</button>
    </div>
    ${swapPanelHtml}
    ${linkPanelHtml}`;
  }

  // tempo: se cambiata (a mano o generata) e in catalogo, usa il tempo della nuova ricetta; altrimenti quello originale del giorno
  const timeDisplay = (isChanged && rec) ? rec.tempo : d.tempo;

  // note: se cambiata, ricostruite dalla ricetta scelta; altrimenti quelle originali del foglio (solo settimana corrente)
  let metaLines = [];
  if(isChanged){
    if(rec){
      if(rec.prep && rec.prep !== 'No') metaLines.push(`<b>Preparazione anticipata:</b> ${escapeHtml(rec.prep)}`);
      if(rec.freezer === 'Sì') metaLines.push(`<b>Nota:</b> congela bene — valuta doppia dose per il freezer`);
    } else {
      metaLines.push(`<b>Nota:</b> ricetta non presente nel catalogo, dettagli non disponibili`);
    }
  } else {
    if(d.ricordare && d.ricordare !== 'Niente') metaLines.push(`<b>Da ricordare:</b> ${escapeHtml(d.ricordare)}`);
    if(d.nota) metaLines.push(`<b>Nota:</b> ${escapeHtml(d.nota)}`);
  }

  // auto reminder: se domani è Legumi, avvisa oggi (il "domani" segue l'ordine
  // di visualizzazione, non l'indice originale, dato che la settimana parte dal sabato;
  // non attraversa il confine tra una settimana e la successiva)
  let soakChip = '';
  if(pos < WEEK_DISPLAY_ORDER.length - 1){
    const nextCat = effectiveCategoria(weekIdx, WEEK_DISPLAY_ORDER[pos+1]);
    if(nextCat === 'legumi'){
      soakChip = `<div class="soak-chip">💧 Domani legumi — valuta l'ammollo stasera</div>`;
    }
  }

  let detailHtml = '';
  if(state.expandedDay === dayKey){
    const det = getRecipeDetails(name);
    // Porzioni scelte per questo giorno (default: quelle base della ricetta),
    // usate per scalare le quantità mostrate qui e — se non già spuntate — in Spesa.
    const basePortions = det ? parsePortionsBase(det.porzioni) : null;
    const currentPortions = basePortions ? (state.dayPortions[dayKey] || basePortions) : null;
    const portionsRatio = basePortions ? currentPortions / basePortions : 1;
    const ing = getIngredientsFor(name);
    const ingHtml = renderIngredientsSection(ing, name, portionsRatio);
    const portionsControl = basePortions ? `
      <div class="portions-row">
        <span class="portions-label">Porzioni</span>
        <span class="qty-stepper">
          <button type="button" class="qty-btn" data-portions-dec="${dayKey}" aria-label="Diminuisci porzioni">−</button>
          <span class="qty-num">${currentPortions}</span>
          <button type="button" class="qty-btn" data-portions-inc="${dayKey}" aria-label="Aumenta porzioni">+</button>
        </span>
      </div>` : '';
    const tagsHtml = rec ? `
      <div class="detail-tags">
        <span class="tag">${catIcon(rec.categoriaNew)} ${escapeHtml(CAT_LABEL[rec.categoriaNew])}</span>
        <span class="tag tempo">${det ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> ' + escapeHtml(det.tempo) : escapeHtml(TEMPO_LABEL[rec.tempoBucket])}</span>
        ${(det && !basePortions) ? `<span class="tag">${escapeHtml(det.porzioni)}</span>` : ''}
        <span class="tag season">${rec.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
        ${(rec.freezerNew && rec.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[rec.freezerNew]}</span>` : ''}
        <span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> ${escapeHtml(AVANZI_LABEL[rec.avanziNew])}</span>
        ${rec.pianificazione!=='nessuna' ? `<span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> ${escapeHtml(PIAN_LABEL[rec.pianificazione])}</span>` : ''}
      </div>` : `<div class="ing-empty">Ricetta non presente nel catalogo — solo ingredienti disponibili qui.</div>`;
    const stepsHtml = det && det.procedimento && det.procedimento.length
      ? `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
      : '';
    const noteExtra = det ? [
        det.ricordare ? `<b>Da ricordare:</b> ${escapeHtml(det.ricordare)}` : '',
        det.avanzi ? `<b>Avanzi:</b> ${escapeHtml(det.avanzi)}` : '',
        det.freezer ? `<b>Freezer:</b> ${escapeHtml(det.freezer)}` : ''
      ].filter(Boolean).map(l=>`<div class="detail-extra-note">${l}</div>`).join('') : '';
    const noteBox = noteExtra ? `<div class="detail-section note-box"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Note</div>${noteExtra}</div>` : '';
    const linkHtml = det && det.link ? `<a class="source-link" href="${escapeAttr(det.link)}" target="_blank" rel="noopener">Fonte della ricetta <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6v2h8.59L5 17.59L6.41 19L16 9.41V18h2V6z"></path></svg></a>` : '';
    const addFormHtml = det ? '' : `
      <div class="add-ing-form">
        <input type="text" placeholder="Ingrediente" data-ning="${dayKey}">
        <input type="text" placeholder="Quantità" data-nqta="${dayKey}">
        <button class="btn is-solid" data-add-ing="${dayKey}">+ aggiungi ingrediente</button>
      </div>`;
    const editRecipeBtn = rec ? `<button class="btn is-chip" data-open-recipe-edit="${escapeAttr(name)}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg> Modifica ricetta</button>` : '';
    const sourceEditBox = (linkHtml || editRecipeBtn) ? `<div class="button-wrapper">${editRecipeBtn}${linkHtml}</div>` : '';
    const dayMetaHtml = metaLines.length ? `<div class="day-meta">${metaLines.map(l=>`<div>${l}</div>`).join('')}</div>` : '';
    detailHtml = `
    <div class="detail-box">
      ${tagsHtml}
      ${dayMetaHtml}
      ${soakChip}
      ${portionsControl}
      ${ingHtml}
      ${stepsHtml}
      ${noteBox}
      ${addFormHtml}
      ${sourceEditBox}
    </div>`;
  }

  const cook = state.cooks[dayKey];
  const isOpen = state.expandedDay === dayKey;
  // Un'unica fonte per "chi cucina": iniziale sola a card chiusa, nome per
  // esteso a card aperta — non più duplicata nel .today-badge separato.
  const cookLabel = cook ? (isOpen ? 'Cucina ' + COOK_LABEL[cook] : COOK_LABEL[cook][0]) : '';
  const cookPill = `<button type="button" class="cook-pill${cook ? ' cook-'+cook : ''}" data-toggle-cook="${dayKey}" aria-label="Chi cucina: tocca per cambiare">${escapeHtml(cookLabel)}</button>`;

  return `
  <div class="day-card${isDone ? ' done' : ''}${isToday ? ' today' : ''}${isOpen ? ' open' : ''}" data-week-idx="${weekIdx}" data-day-index="${i}">
    <div class="day-row">
      <div class="day-name">${d.giorno} <span class="day-date">${dateLabel}</span></div>
      ${cookPill}
      <div class="day-row-side">
        <span class="cat-icon" title="${escapeAttr(CAT_LABEL[currentCat])}">${catIcon(currentCat)}</span>
      </div>
    </div>
    <div class="day-menu-row">
      <span class="day-menu" data-toggle-day="${dayKey}">${escapeHtml(name)}</span>
      <button type="button" class="drag-handle" data-drag-handle aria-label="Trascina per scambiare la ricetta con un altro giorno">⠿</button>
    </div>
    <span class="day-time">${escapeHtml(timeDisplay)}</span>
    ${detailHtml}
    ${swapControls}
  </div>`;
}

// Bottone icona "impostazioni generazione" (giorni veloci): riusato ovunque
// si possa generare/rigenerare/aggiungere una settimana, così apre sempre
// lo stesso modale (renderMenu -> genSettingsModal).
// Pannello profilo nel foglio Impostazioni: nome, prossimo turno di cucina,
// colore identità. Ricostruito ogni volta che il foglio si apre e a ogni
// cambio colore (vedi wiring in fondo al file), non fa parte del render() principale.
function renderProfilePanel(){
  const user = getCurrentUser();
  if(!user) return '';
  const next = nextCookDayFor(user);
  const nextLine = next
    ? `Prossimo turno: <b>${escapeHtml(next.giorno)} ${escapeHtml(next.dateLabel)}</b>${next.name ? ' — '+escapeHtml(next.name) : ''}`
    : 'Nessun turno di cucina in programma.';
  const swatches = USER_COLOR_PRESETS.map(c=>`<button type="button" class="color-swatch${state.userColors[user]===c?' active':''}" style="background:${c}" data-user-color="${c}" aria-label="Scegli questo colore"></button>`).join('');
  return `
    <div class="profile-panel">
      <div class="profile-name">${escapeHtml(COOK_LABEL[user])}</div>
      <p class="profile-next-cook">${nextLine}</p>
      <div class="filter-group-label">Il tuo colore</div>
      <div class="color-swatch-row">${swatches}</div>
    </div>`;
}

function genSettingsButton(){
  return `<button class="btn is-icon" type="button" data-open-gen-settings aria-label="Impostazioni generazione menù"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"></path><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path></g></svg></button>`;
}

// Un blocco settimana completo: intestazione con data, striscia categorie,
// 7 giorni, e i controlli per generare/rigenerare (e, per le extra, rimuovere).
function renderWeekSection(weekIdx){
  const weekDates = weekDatesFor(weekIdx);
  // Nella settimana corrente non ha senso mostrare le card dei giorni già
  // passati: si parte da oggi. Nelle settimane extra (sempre future) si
  // mostrano tutte. La striscia delle iconcine invece resta sull'intera
  // settimana (anche i giorni passati), per avere sempre colpo d'occhio
  // sulla variazione di categoria durante tutta la settimana.
  const startPos = weekIdx === 0 ? (findTodayPos() ?? 0) : 0;
  const allPositions = [];
  for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++) allPositions.push(pos);
  const positions = allPositions.filter(pos => pos >= startPos);

  const strip = allPositions.map(pos=>{
    const i = WEEK_DISPLAY_ORDER[pos];
    const d = DATA.week1[i];
    const cat = effectiveCategoria(weekIdx, i);
    const isToday = isSameDay(weekDates[pos], new Date());
    // I giorni già passati (pos < startPos) sono visibili solo qui, la loro
    // card è nascosta più sotto — vedi startPos: niente da fare scorrendoci,
    // quindi la classe "past" li marca per uno stile disabilitato via CSS.
    const isPast = pos < startPos;
    return `<div class="balance-chip${isToday ? ' today' : ''}${isPast ? ' past' : ''}" data-scroll-to-day="${weekIdx}_${i}">
      <div class="bd">${d.giorno.slice(0,3)}</div>
      <div class="bc">${cat ? catIcon(cat) : '—'}</div>
    </div>`;
  }).join('');

  const days = positions.map(pos=> renderDayCard(weekIdx, WEEK_DISPLAY_ORDER[pos], pos, weekDates)).join('');

  const genSettingsBtn = genSettingsButton();

  const controls = weekIdx === 0 ? `
    <div class="generate-week-block">
      <div class="generate-week-row">
        <button class="btn is-outline" data-generate-week="0"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 48v48a12 12 0 0 1-12 12h-48a12 12 0 0 1 0-24h19l-7.8-7.8a75.55 75.55 0 0 0-53.32-22.26h-.43a75.5 75.5 0 0 0-53.06 21.63a12 12 0 1 1-16.78-17.16a99.38 99.38 0 0 1 69.87-28.47h.52a99.42 99.42 0 0 1 70.2 29.29L204 67V48a12 12 0 0 1 24 0m-44.39 132.43a75.5 75.5 0 0 1-53.09 21.63h-.43a75.55 75.55 0 0 1-53.32-22.26L69 172h19a12 12 0 0 0 0-24H40a12 12 0 0 0-12 12v48a12 12 0 0 0 24 0v-19l7.8 7.8a99.42 99.42 0 0 0 70.2 29.26h.56a99.38 99.38 0 0 0 69.87-28.47a12 12 0 0 0-16.78-17.16Z"></path></svg>Genera nuovo menù</button>
        ${genSettingsBtn}
      </div>
      <p class="generate-week-hint">Sceglie 7 ricette di stagione, variando le categorie giorno per giorno.</p>
    </div>` : `
    <div class="generate-week-block is-added">
      <div class="generate-week-row">
        <button class="btn is-outline" data-generate-week="${weekIdx}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 48v48a12 12 0 0 1-12 12h-48a12 12 0 0 1 0-24h19l-7.8-7.8a75.55 75.55 0 0 0-53.32-22.26h-.43a75.5 75.5 0 0 0-53.06 21.63a12 12 0 1 1-16.78-17.16a99.38 99.38 0 0 1 69.87-28.47h.52a99.42 99.42 0 0 1 70.2 29.29L204 67V48a12 12 0 0 1 24 0m-44.39 132.43a75.5 75.5 0 0 1-53.09 21.63h-.43a75.55 75.55 0 0 1-53.32-22.26L69 172h19a12 12 0 0 0 0-24H40a12 12 0 0 0-12 12v48a12 12 0 0 0 24 0v-19l7.8 7.8a99.42 99.42 0 0 0 70.2 29.26h.56a99.38 99.38 0 0 0 69.87-28.47a12 12 0 0 0-16.78-17.16Z"></path></svg> Rigenera questa settimana</button>
        ${genSettingsBtn}
      </div>
      <button class="btn is-icon color-delete" data-remove-week="${weekIdx}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
    </div>`;

  return `
    <section class="week-section">
      <h2 class="week-title">Settimana del ${weekLabelFor(weekIdx)}</h2>
      <div class="balance-strip">${strip}</div>
      ${days}
      ${controls}
    </section>`;
}

// Posizione (0..6, ordine di visualizzazione) del giorno di oggi nella
// settimana 0: c'è sempre, dato che la settimana 0 è ancorata a "oggi"
// (vedi upcomingSaturday). Usata dall'header "Oggi" e per il badge del giorno.
function findTodayPos(){
  const dates = weekDatesFor(0);
  const today = new Date();
  for(let pos=0; pos<WEEK_DISPLAY_ORDER.length; pos++){
    if(isSameDay(dates[pos], today)) return pos;
  }
  return null;
}

// Header "Oggi" in cima al Menù: lo stato della casa (spesa da fare,
// dispensa in esaurimento, domani) — la cena di stasera non è più ripetuta
// qui perché la scheda del giorno corrente è già aperta di default subito
// sotto, nella lista della settimana.
function renderMenu(){
  const weekSections = [0, ...state.extraWeeks.map((_,n)=>n+1)]
    .map(weekIdx => renderWeekSection(weekIdx)).join('');

  // Promemoria "oggi/domani cucini tu", solo in app (niente push): un
  // banner chiudibile, che resta chiuso per quel giorno finché non lo si
  // riapre (stessa logica di dismissione già usata per lo shopping).
  let reminderBanner = '';
  const currentUser = getCurrentUser();
  if(currentUser){
    const next = nextCookDayFor(currentUser);
    if(next && (next.daysFromToday === 0 || next.daysFromToday === 1) && !state.notifDismissed[next.dayKey]){
      const when = next.daysFromToday === 0 ? 'Oggi' : 'Domani';
      reminderBanner = `
      <div class="cook-reminder-banner">
        <span>${when} cucini tu${next.name ? ': <b>'+escapeHtml(next.name)+'</b>' : ''}</span>
        <button type="button" class="btn is-icon" data-dismiss-reminder="${next.dayKey}" aria-label="Chiudi promemoria">✕</button>
      </div>`;
    }
  }

  // Promemoria "ieri hai mangiato X?": se il giorno di ieri (nella settimana
  // corrente) aveva una ricetta e nessuno l'ha ancora segnata come mangiata,
  // lo chiede appena si riapre l'app — altrimenti gli ingredienti restano in
  // Dispensa anche se in realtà sono stati usati. Non copre il salto sabato
  // (ieri = venerdì della settimana appena chiusa, non più raggiungibile).
  let eatenReminderBanner = '';
  {
    const startPos = findTodayPos() ?? 0;
    if(startPos > 0){
      const yestPos = startPos - 1;
      const yestI = WEEK_DISPLAY_ORDER[yestPos];
      const yestKey = `0_${yestI}`;
      const yestMealsDone = weekMealsDoneRef(0);
      const yestName = effectiveRecipeName(0, yestI);
      if(yestName && !yestMealsDone[yestI] && !state.mealsDoneReminderDismissed[yestKey]){
        eatenReminderBanner = `
        <div class="eaten-reminder-banner">
          <span>Ieri (${escapeHtml(DATA.week1[yestI].giorno)}) hai mangiato <b>${escapeHtml(yestName)}</b>?</span>
          <div class="eaten-reminder-actions">
            <button type="button" class="btn is-solid mini-add-btn" data-toggle-done="${yestKey}">Sì, segna</button>
            <button type="button" class="btn is-ghost" data-dismiss-eaten-reminder="${yestKey}">No</button>
          </div>
        </div>`;
      }
    }
  }

  let doneModal = '';
  if(state.doneModalDay !== null){
    const [dw, di] = state.doneModalDay.split('_');
    const doneWeekIdx = parseInt(dw,10);
    const doneName = effectiveRecipeName(doneWeekIdx, di);
    const doneIng = getIngredientsFor(doneName);
    const qtyMap = state.doneModalQty || {};
    doneModal = `
    <div class="filters-modal-backdrop" data-close-done-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Ricetta fatta! 🎉</h3>
          <button class="btn is-icon filters-close-btn" data-close-done-modal>✕</button>
        </div>
        <p class="section-sub" style="margin-top:-8px;">Quanto ti resta in Dispensa di ogni ingrediente? Aggiusta solo quello che hai usato — il resto non cambia.</p>
        ${doneIng.length ? `
        <div class="done-ing-list">
          ${doneIng.map(it=>{
            const name = it.ingrediente;
            const tracked = Object.prototype.hasOwnProperty.call(qtyMap, name);
            if(!tracked){
              return `<div class="done-ing-row untracked"><span>${escapeHtml(name)}</span><span class="done-ing-hint">non in dispensa</span></div>`;
            }
            return `
            <div class="done-ing-row">
              <span>${escapeHtml(name)}</span>
              <span class="qty-stepper">
                <button class="qty-btn" type="button" data-done-qty-dec="${escapeAttr(name)}" aria-label="Diminuisci">−</button>
                <span class="qty-num">${qtyMap[name]}</span>
                <button class="qty-btn" type="button" data-done-qty-inc="${escapeAttr(name)}" aria-label="Aumenta">+</button>
              </span>
            </div>`;
          }).join('')}
        </div>` : `<div class="ing-empty">Nessun ingrediente salvato per questa ricetta.</div>`}
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" data-close-done-modal>Annulla</button>
          <button class="btn is-solid mini-add-btn" data-confirm-done="${state.doneModalDay}">Conferma</button>
        </div>
      </div>
    </div>`;
  }

  const genSettingsModal = state.genSettingsOpen ? `
    <div class="filters-modal-backdrop" data-close-gen-settings>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Impostazioni generazione</h3>
          <button class="btn is-icon filters-close-btn" data-close-gen-settings>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Durata massima ricette per giorno</div>
            <div class="tempo-cap-list">
              ${DATA.week1.map((d,idx)=>{
                const cap = state.dayTempoCap[idx] || 'progetto';
                const capIdx = TEMPO_ORDER.indexOf(cap);
                const dots = TEMPO_ORDER.map((t,i)=>`<button type="button" class="tempo-cap-dot${i<=capIdx?' active':''}" data-tempo-cap-day="${idx}" data-tempo-cap-level="${t}" aria-label="${escapeAttr(TEMPO_LABEL[t])}">${TEMPO_LABEL[t].split(' ')[0]}</button>`).join('');
                return `<div class="tempo-cap-row">
                  <span class="tempo-cap-day-label">${escapeHtml(d.giorno.slice(0,3))}</span>
                  <span class="tempo-cap-dots">${dots}</span>
                </div>`;
              }).join('')}
            </div>
            <p class="section-sub" style="margin:0.5rem 0 0;">Tocca fino a dove vuoi arrivare: quel giorno la generazione sceglierà solo ricette entro quella durata.</p>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-solid mini-add-btn" data-close-gen-settings>Fatto</button>
        </div>
      </div>
    </div>` : '';

  return `
    ${eatenReminderBanner}
    ${reminderBanner}
    ${weekSections}
    ${doneModal}
    ${renderRecipeEditModal()}
    ${genSettingsModal}
    <div class="generate-week-block">
      <div class="generate-week-row">
        <button class="btn is-solid" id="add-week">+ Aggiungi settimana</button>
        ${genSettingsButton()}
      </div>
      <p class="generate-week-hint">Pianifica un'altra settimana con le stesse regole.</p>
    </div>
  `;
}

function renderSpesa(){
  // costruisco una lista piatta di tutti gli articoli (settimana corrente + extra), con contesto e chiave stabile
  const flat = [];
  allPlannedDays().forEach(({weekIdx,i,giorno,dateLabel,name})=>{
    const dayKey = `${weekIdx}_${i}`;
    const det = getRecipeDetails(name);
    const basePortions = det ? parsePortionsBase(det.porzioni) : null;
    const ratio = basePortions ? (state.dayPortions[dayKey] || basePortions) / basePortions : 1;
    const items = getIngredientsFor(name);
    items.forEach((it,idx)=>{
      const key = dayIngKey(weekIdx, i, idx);
      if(state.shopDismissed[key]) return;
      // Le quantità scalate valgono solo finché non è già stato spuntato:
      // quello già preso non deve cambiare retroattivamente se poi si aggiustano le porzioni.
      const qta = state.shopChecked[key] ? it.qta : scaleQtyText(it.qta, ratio);
      flat.push({ key, ingrediente:it.ingrediente, qta, dove:it.dove, note:it.note, context:`${giorno} ${dateLabel} · ${name}`, staple: isStaple(it.ingrediente) });
    });
  });
  DATA.generalShopping.forEach((it,idx)=>{
    const key = `gen_${idx}`;
    if(state.shopDismissed[key]) return;
    flat.push({ key, ingrediente:it.ingrediente, qta:it.qta, dove:it.dove, note:it.note, context:'Ogni settimana', staple: isStaple(it.ingrediente) });
  });
  Object.entries(state.shopExtras).forEach(([id, it])=>{
    if(state.shopDismissed[id]) return;
    flat.push({ key:id, ingrediente:it.ingrediente, qta:it.qta, dove:'', note:'', context:'Aggiunti a mano', staple: isStaple(it.ingrediente) });
  });
  // Ingredienti finiti in Dispensa (qty scesa a 0): la voce di Dispensa non
  // viene mai cancellata quando arriva a 0, resta lì con la sua unità/luogo/
  // categoria — quando la spunti e la sposti in Dispensa aggiorna quello
  // stesso record invece di doverlo ricreare da capo.
  Object.entries(state.pantryItems).forEach(([pantryKey, it])=>{
    if(typeof it.qty !== 'number' || it.qty > 0) return;
    const key = `oos_${pantryKey}`;
    if(state.shopDismissed[key]) return;
    flat.push({ key, ingrediente:it.nome, qta:'', dove:'', note:'', context:'Finiti in Dispensa', staple: isStaple(it.nome), confirmed: !!state.pantryConfirmedShop[pantryKey] });
  });

  // I basilari già confermati - a mano o perché presenti in Dispensa - non
  // finiscono più in una sezione a parte: restano nella lista normale (per
  // giorno/per reparto) ma già spuntati, coerente con isStapleConfirmed.
  const mainFlat = flat;

  function isItemChecked(keys, ingrediente){
    if(isStaple(ingrediente)) return isStapleConfirmed({keys, ingrediente});
    return keys.every(k=>state.shopChecked[k]);
  }

  const total = mainFlat.length;
  const done = mainFlat.filter(it=>isItemChecked([it.key], it.ingrediente)).length;
  // Le spuntate in "Finiti" hanno le loro azioni dedicate (Elimina/Aggiungi
  // alla lista, vedi la sezione più sotto) — non contano per la barra globale
  // Elimina/Sposta in dispensa, che altrimenti comparirebbe due volte con
  // un'azione ("Sposta in dispensa") che per un ingrediente già in Dispensa
  // non ha senso.
  const doneShoppable = mainFlat.filter(it=> it.context !== 'Finiti in Dispensa' && isItemChecked([it.key], it.ingrediente)).length;

  function itemRow(keys, ingrediente, qta, note, subtitle, forcedChecked){
    const checked = forcedChecked !== undefined ? forcedChecked : isItemChecked(keys, ingrediente);
    const rowKey = keys.join(',');
    const qty = (typeof state.shopQty[rowKey] === 'number') ? state.shopQty[rowKey] : 1;
    const editingQty = state.shopQtyEditingKey === rowKey;
    return `
    <div class="shop-item-row">
      <label class="shop-item ${checked?'checked':''}">
        <input type="checkbox" data-shop-keys="${rowKey}" data-shop-name="${escapeAttr(ingrediente)}" ${checked?'checked':''}>
        <span>
          <span class="item-name">${escapeHtml(ingrediente)}</span>
          <span class="item-detail">${escapeHtml(qta||'')}${subtitle ? ' · ' + escapeHtml(subtitle) : ''}${note ? ' · ' + escapeHtml(note) : ''}</span>
        </span>
      </label>
      <span class="qty-stepper" title="Quantità da prendere">
        <button class="qty-btn" type="button" data-shop-qty-dec="${escapeAttr(rowKey)}" aria-label="Diminuisci quantità">−</button>
        ${editingQty
          ? `<input type="number" min="1" class="qty-input" value="${qty}" data-shop-qty-edit="${escapeAttr(rowKey)}">`
          : `<span class="qty-num" data-shop-qty-show="${escapeAttr(rowKey)}">${qty}</span>`}
        <button class="qty-btn" type="button" data-shop-qty-inc="${escapeAttr(rowKey)}" aria-label="Aumenta quantità">+</button>
      </span>
      <button class="btn-remove" data-shop-remove="${rowKey}" type="button" aria-label="Elimina ${escapeAttr(ingrediente)}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
    </div>`;
  }

  let body = '';
  if(state.shopView === 'reparto'){
    // classifico ogni articolo per reparto, e per la verdura forzo il negozio Fruttivendolo.
    // I "Finiti in Dispensa" vanno nel loro reparto dedicato invece che in "Altro"
    // (o nel reparto merceologico vero, che a colpo d'occhio non spiegherebbe il perché sono lì)
    // — a meno che non siano stati "aggiunti alla lista" da Spesa: a quel punto si mescolano
    // nel loro reparto vero, tra le sezioni normali del negozio.
    const classified = mainFlat.map(it=>{
      const dept = (it.context === 'Finiti in Dispensa' && !it.confirmed) ? 'finiti' : classifyDept(it.ingrediente);
      const store = dept === 'verdura' ? 'Fruttivendolo' : (it.dove || 'Supermercato');
      return {...it, dept, store};
    });
    // unisco articoli identici (stesso ingrediente + stessa quantità) comparsi in più ricette
    const merged = {};
    classified.forEach(it=>{
      const mergeKey = (it.ingrediente||'').trim().toLowerCase() + '|' + (it.qta||'').trim().toLowerCase();
      if(!merged[mergeKey]){
        merged[mergeKey] = { ingrediente: it.ingrediente, qta: it.qta, note: it.note, dept: it.dept, store: it.store, keys: [it.key], contexts: [it.context] };
      } else {
        merged[mergeKey].keys.push(it.key);
        if(!merged[mergeKey].contexts.includes(it.context)) merged[mergeKey].contexts.push(it.context);
      }
    });
    const mergedList = Object.values(merged);

    const stores = {};
    mergedList.forEach(it=>{
      if(!stores[it.store]) stores[it.store] = [];
      stores[it.store].push(it);
    });
    body = Object.entries(stores).map(([store, items])=>{
      const byDept = {};
      items.forEach(it=>{
        if(!byDept[it.dept]) byDept[it.dept] = [];
        byDept[it.dept].push(it);
      });
      const deptSections = DEPT_ORDER
        .filter(dept => byDept[dept] && byDept[dept].length)
        .map(dept => `
          <div class="dept-block">
            <div class="dept-title"><span class="dept-icon">${DEPT_ICON[dept]}</span>${DEPT_LABEL[dept]}</div>
            ${byDept[dept].map(it=>itemRow(it.keys, it.ingrediente, it.qta, it.note, it.contexts.join(' + '))).join('')}
          </div>`).join('');
      const assignee = state.shopAssignees[store];
      // "Supermercato" è il negozio di default (nessun "dove" specifico sull'ingrediente):
      // la spesa lì non si assegna a nessuno per ora, quindi niente bottone Assegna.
      const assigneeBtn = store === 'Supermercato' ? '' : `<button type="button" class="btn is-text shop-assignee-btn${assignee ? ' assigned assignee-'+assignee : ''}" data-toggle-assignee="${escapeAttr(store)}">${assignee ? escapeHtml(COOK_LABEL[assignee]) : 'Assegna'}</button>`;
      return `
      <div class="shop-day-group">
        <div class="shop-day-title">
          <span>${escapeHtml(store)}</span>
          ${assigneeBtn}
        </div>
        ${deptSections}
      </div>`;
    }).join('');
  } else {
    body = allPlannedDays().map(({giorno,dateLabel,name})=>{
      const context = `${giorno} ${dateLabel} · ${name}`;
      const dayItems = mainFlat.filter(it => it.context === context);
      const rows = dayItems.length
        ? dayItems.map(it=>itemRow([it.key], it.ingrediente, it.qta, it.note, it.dove)).join('')
        : `<div class="ing-empty">Nessun ingrediente salvato — aprilo dal Menù e aggiungili dalla scheda ricetta.</div>`;
      return `
      <div class="shop-day-group">
        <div class="shop-day-title"><span class="font-weight-bold">${escapeHtml(name)}</span>${escapeHtml(giorno.slice(0,3))} ${escapeHtml(dateLabel)}</div>
        ${rows}
      </div>`;
    }).join('');
    const genContext = mainFlat.filter(it => it.context === 'Ogni settimana');
    if(genContext.length){
      body += `
      <div class="shop-day-group">
        <div class="shop-day-title">Ogni settimana</div>
        ${genContext.map(it=>itemRow([it.key], it.ingrediente, it.qta, it.note, it.dove)).join('')}
      </div>`;
    }
    const extraContext = mainFlat.filter(it => it.context === 'Aggiunti a mano');
    if(extraContext.length){
      body += `
      <div class="shop-day-group">
        <div class="shop-day-title">Aggiunti a mano</div>
        ${extraContext.map(it=>itemRow([it.key], it.ingrediente, it.qta, it.note, it.dove)).join('')}
      </div>`;
    }
    // Chi è già stato "aggiunto alla lista" (vedi data-finished-shop-addlist)
    // esce da qui: lo si ritrova nella vista Per reparto, mescolato al suo
    // reparto vero — qui in Per giorno non ha un posto naturale dove stare.
    const oosContext = mainFlat.filter(it => it.context === 'Finiti in Dispensa' && !it.confirmed);
    if(oosContext.length){
      const oosCheckedCount = oosContext.filter(it => state.shopChecked[it.key]).length;
      body += `
      <div class="shop-day-group finished-shop-group">
        <div class="shop-day-title">Finiti</div>
        ${oosContext.map(it=>itemRow([it.key], it.ingrediente, it.qta, it.note, it.dove)).join('')}
        ${oosCheckedCount ? `
        <div class="finished-shop-actions">
          <button type="button" class="btn is-outline color-delete" data-finished-shop-delete>Elimina (${oosCheckedCount})</button>
          <button type="button" class="btn is-solid" data-finished-shop-addlist>Aggiungi alla lista (${oosCheckedCount})</button>
        </div>` : ''}
      </div>`;
    }
  }

  const missingDays = allPlannedDays()
    .map(({giorno,dateLabel,name})=>({giorno, dateLabel, nome:name}))
    .filter(d => !(getIngredientsFor(d.nome) && getIngredientsFor(d.nome).length));
  const missingBanner = missingDays.length ? `
    <div class="missing-ing-banner">
      ⚠️ Ingredienti non ancora salvati per: ${missingDays.map(d=>`${escapeHtml(d.giorno)} ${escapeHtml(d.dateLabel)} (${escapeHtml(d.nome)})`).join(', ')}. Aprili dal Menù per aggiungerli.
    </div>` : '';

  const addIngModal = state.addIngModalOpen ? `
    <div class="filters-modal-backdrop" data-close-add-ing-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Aggiungi ingrediente</h3>
          <button class="btn is-icon filters-close-btn" data-close-add-ing-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Ingrediente</div>
            <input type="text" id="shop-add-name" placeholder="Es. Carta forno">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Quantità</div>
            <input type="text" id="shop-add-qta" placeholder="Es. 1 rotolo">
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" data-close-add-ing-modal>Annulla</button>
          <button class="btn is-solid mini-add-btn" id="shop-add-btn" type="button">Aggiungi</button>
        </div>
      </div>
    </div>` : '';

  return `
    <h2 class="section-title">Spesa</h2>
    <p class="section-sub">Si aggiorna in automatico in base al menù attuale — quello che hai già in Dispensa parte già spuntato</p>
    ${missingBanner}
    <div class="view-toggle">
      <button class="view-btn ${state.shopView==='reparto'?'active':''}" data-shop-view="reparto">Per reparto</button>
      <button class="view-btn ${state.shopView!=='reparto'?'active':''}" data-shop-view="giorno">Per giorno</button>
    </div>
    <div class="shop-progress">${done} / ${total} presi</div>
    <button class="btn is-ghost reset-btn" id="reset-shop">Svuota spunte</button>
    ${body}
    ${doneShoppable ? `
    <div class="shop-checked-actions">
      <button class="btn is-outline" id="delete-checked-shop">Elimina ${doneShoppable} spuntati</button>
      <button class="btn is-solid" id="move-checked-to-pantry">Sposta ${doneShoppable} in dispensa</button>
    </div>` : ''}
    ${addIngModal}
    <button class="btn is-solid is-icon fab" id="spesa-fab" type="button" aria-label="Aggiungi ingrediente"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>
  `;
}

function renderPrep(){
  let list = allRecipeMetas().filter(r=>{
    if(state.filters.cat.length && !state.filters.cat.includes(r.categoriaNew)) return false;
    if(state.filters.tempo && r.tempoBucket !== state.filters.tempo) return false;
    if(state.filters.pian && r.pianificazione !== state.filters.pian) return false;
    if(state.filters.stagione && !(r.stagioni.includes(state.filters.stagione) || r.stagioni.includes('tutto'))) return false;
    if(state.filters.avanzi && r.avanziNew !== state.filters.avanzi) return false;
    if(state.filters.freezer && r.freezerNew !== state.filters.freezer) return false;
    if(state.filters.grad && r.gradimento !== state.filters.grad) return false;
    if(state.filters.attrezz && !r.attrezzatura.includes(state.filters.attrezz)) return false;
    if(state.filters.search && !r.nome.toLowerCase().includes(state.filters.search.toLowerCase())) return false;
    return true;
  });
  const cards = list.map(r=>{
    const isOpen = state.expandedRecipe === r.nome;
    const det = getRecipeDetails(r.nome);
    const ing = getIngredientsFor(r.nome);
    let detail = '';
    if(isOpen){
      const tagsHtml = `
        <div class="detail-tags">
          <span class="tag season">${r.stagioni.map(s=>escapeHtml(STAGIONE_LABEL[s])).join(', ')}</span>
          ${(r.freezerNew && r.freezerNew !== 'non-adatta') ? `<span class="tag freezer">${FREEZER_LABEL[r.freezerNew]}</span>` : ''}
          <span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> ${escapeHtml(AVANZI_LABEL[r.avanziNew])}</span>
          ${r.pianificazione!=='nessuna' ? `<span class="tag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> ${escapeHtml(PIAN_LABEL[r.pianificazione])}</span>` : ''}
        </div>`;
      const ingHtml = renderIngredientsSection(ing, r.nome);
      const stepsHtml = det && det.procedimento && det.procedimento.length
        ? `<div class="detail-section"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c1.918 0 3.52 1.35 3.91 3.151A4 4 0 0 1 18 13.874V21H6v-7.126a4 4 0 1 1 2.092-7.723A4 4 0 0 1 12 3M6.161 17.009L18 17"></path></svg> Procedimento</div><ol class="steps-list">${det.procedimento.map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol></div>`
        : '';
      const noteExtra = det ? [
          det.porzioni ? `<b>Porzioni:</b> ${escapeHtml(det.porzioni)}` : '',
          det.ricordare ? `<b>Da ricordare:</b> ${escapeHtml(det.ricordare)}` : '',
          det.avanzi ? `<b>Avanzi:</b> ${escapeHtml(det.avanzi)}` : '',
          det.freezer ? `<b>Freezer:</b> ${escapeHtml(det.freezer)}` : ''
        ].filter(Boolean).map(l=>`<div class="detail-extra-note">${l}</div>`).join('') : '';
      const noteBox = noteExtra ? `<div class="detail-section note-box"><div class="detail-section-title"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M88 96a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16H96a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16H96a8 8 0 0 0 0 16m32 16H96a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16m96-104v108.69a15.86 15.86 0 0 1-4.69 11.31L168 219.31a15.86 15.86 0 0 1-11.31 4.69H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h104v-48a8 8 0 0 1 8-8h48V48H48Zm120-40v28.7l28.69-28.7Z"></path></svg> Note</div>${noteExtra}</div>` : '';
      const linkHtml = det && det.link ? `<a class="source-link" href="${escapeAttr(det.link)}" target="_blank" rel="noopener">Fonte della ricetta <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M6 6v2h8.59L5 17.59L6.41 19L16 9.41V18h2V6z"></path></svg></a>` : '';
      const addFormHtml = det ? '' : `
        <div class="add-ing-form">
          <input type="text" placeholder="Ingrediente" data-rning="${escapeAttr(r.nome)}">
          <input type="text" placeholder="Quantità" data-rnqta="${escapeAttr(r.nome)}">
          <button class="btn is-solid" data-add-ing-recipe="${escapeAttr(r.nome)}">+ aggiungi ingrediente</button>
        </div>`;
      const editRecipeBtn = `<button class="btn is-chip" data-open-recipe-edit="${escapeAttr(r.nome)}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M91 204H52v-39l84-84l39 39Zm101-101l-39-39l18.34-18.34l39 39Z"></path></svg> Modifica ricetta</button>`;
      detail = `
      <div class="detail-box">
        ${tagsHtml}
        ${ingHtml}
        ${stepsHtml}
        ${noteBox}
        ${addFormHtml}
        <div class="button-wrapper">${editRecipeBtn}${linkHtml}</div>
      </div>`;
    }
    return `
    <div class="day-card${isOpen ? ' open' : ''}" data-toggle-recipe="${escapeAttr(r.nome)}">
      <div class="day-row">
        <div>
          <div class="day-menu">${escapeHtml(r.nome)}${det ? ' <span class="full-badge" title="Ricetta completa con procedimento"></span>' : ''}</div>
          <span class="day-time">${escapeHtml(r.tempo)}</span>
        </div>
        <div class="day-row-side">
          <span class="cat-icon" title="${escapeAttr(CAT_LABEL[r.categoriaNew])}">${catIcon(r.categoriaNew)}</span>
        </div>
      </div>
      ${detail}
    </div>`;
  }).join('');

  function selectHtml(id, label, order, labelMap, current){
    return `<select id="${id}"><option value="">${label}</option>${order.map(v=>`<option value="${v}" ${current===v?'selected':''}>${escapeHtml(stripHtml(labelMap[v]))}</option>`).join('')}</select>`;
  }

  const activeCount = ['tempo','pian','stagione','avanzi','freezer','grad','attrezz'].filter(k=>state.filters[k]).length + (state.filters.cat.length ? 1 : 0);

  const filtersModal = state.filtersOpen ? `
    <div class="filters-modal-backdrop" data-close-filters>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Filtri</h3>
          <button class="btn is-icon filters-close-btn" data-close-filters>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10h-2V3H8v7H6V3H4v8c0 1.654 1.346 3 3 3h1v7h2v-7h1c1.654 0 3-1.346 3-3V3h-2zm7-7h-1c-1.159 0-2 1.262-2 3v8h2v7h2V4a1 1 0 0 0-1-1"></path></svg> Categoria</div>
            <div class="chip-row">
              <button class="btn is-chip ${!state.filters.cat.length?'active':''}" data-cat-clear>Tutte</button>
              ${CAT_ORDER.map(c=>`<button class="btn is-chip ${state.filters.cat.includes(c)?'active':''}" data-cat-chip="${c}">${catIcon(c)} ${escapeHtml(CAT_LABEL[c])}</button>`).join('')}
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M128 20a108 108 0 1 0 108 108A108.12 108.12 0 0 0 128 20m0 192a84 84 0 1 1 84-84a84.09 84.09 0 0 1-84 84m68-84a12 12 0 0 1-12 12h-56a12 12 0 0 1-12-12V72a12 12 0 0 1 24 0v44h44a12 12 0 0 1 12 12"></path></svg> Tempo</div>
            ${selectHtml('f-tempo', 'Tutti i tempi', TEMPO_ORDER, TEMPO_LABEL, state.filters.tempo)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160zm-96-88v64a8 8 0 0 1-16 0v-51.06l-4.42 2.22a8 8 0 0 1-7.16-14.32l16-8A8 8 0 0 1 112 120m59.16 30.45L152 176h16a8 8 0 0 1 0 16h-32a8 8 0 0 1-6.4-12.8l28.78-38.37a8 8 0 1 0-13.31-8.83a8 8 0 1 1-13.85-8A24 24 0 0 1 176 136a23.76 23.76 0 0 1-4.84 14.45"></path></svg> Pianificazione</div>
            ${selectHtml('f-pian', 'Qualsiasi', PIAN_ORDER, PIAN_LABEL, state.filters.pian)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96M19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3"></path></svg> Stagione</div>
            ${selectHtml('f-stagione', 'Tutte le stagioni', STAGIONE_ORDER, STAGIONE_LABEL, state.filters.stagione)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--tabler" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m13.62 8.382l1.966-1.967A2 2 0 1 1 19 5a2 2 0 1 1-1.413 3.414l-1.82 1.821m-9.863 8.361c2.733 2.734 5.9 4 7.07 2.829c1.172-1.172-.094-4.338-2.828-7.071c-2.733-2.734-5.9-4-7.07-2.829c-1.172 1.172.094 4.338 2.828 7.071M7.5 16l1 1"></path><path d="M12.975 21.425c3.905-3.906 4.855-9.288 2.121-12.021c-2.733-2.734-8.115-1.784-12.02 2.121"></path></g></svg> Avanzi</div>
            ${selectHtml('f-avanzi', 'Qualsiasi', AVANZI_ORDER, AVANZI_LABEL, state.filters.avanzi)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M227.65 149.14a12 12 0 0 1-8.79 14.51l-20.67 5.08l5.4 20.16a12 12 0 0 1-23.18 6.22l-7.29-27.2L140 148.78V187l20.48 20.48a12 12 0 0 1-17 17L128 209l-15.51 15.52a12 12 0 0 1-17-17L116 187v-38.22l-33.12 19.13l-7.29 27.2a12 12 0 0 1-23.18-6.22l5.4-20.16l-20.67-5.08a12 12 0 1 1 5.72-23.3l27.89 6.85L104 128l-33.25-19.2l-27.89 6.85A11.8 11.8 0 0 1 40 116a12 12 0 0 1-2.85-23.65l20.67-5.08l-5.4-20.16a12 12 0 0 1 23.18-6.22l7.29 27.2L116 107.21V69L95.52 48.48a12 12 0 0 1 17-17L128 47l15.51-15.52a12 12 0 1 1 17 17L140 69v38.24l33.12-19.12l7.29-27.2a12 12 0 0 1 23.18 6.22l-5.4 20.16l20.67 5.08A12 12 0 0 1 216 116a11.8 11.8 0 0 1-2.87-.35l-27.89-6.85L152 128l33.25 19.2l27.89-6.85a12 12 0 0 1 14.51 8.79"></path></svg> Freezer</div>
            ${selectHtml('f-freezer', 'Qualsiasi', FREEZER_ORDER, FREEZER_LABEL, state.filters.freezer)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M178 36c-20.09 0-37.92 7.93-50 21.56C115.92 43.93 98.09 36 78 36a66.08 66.08 0 0 0-66 66c0 72.34 105.81 130.14 110.31 132.57a12 12 0 0 0 11.38 0C138.19 232.14 244 174.34 244 102a66.08 66.08 0 0 0-66-66m-5.49 142.36a328.7 328.7 0 0 1-44.51 31.8a328.7 328.7 0 0 1-44.51-31.8C61.82 159.77 36 131.42 36 102a42 42 0 0 1 42-42c17.8 0 32.7 9.4 38.89 24.54a12 12 0 0 0 22.22 0C145.3 69.4 160.2 60 178 60a42 42 0 0 1 42 42c0 29.42-25.82 57.77-47.49 76.36"></path></svg> Gradimento</div>
            ${selectHtml('f-grad', 'Qualsiasi', GRAD_ORDER, GRAD_LABEL, state.filters.grad)}
          </div>
          <div class="filter-group">
            <div class="filter-group-label"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M177.62 159.6a52 52 0 0 1-34 34a12.2 12.2 0 0 1-3.6.55a12 12 0 0 1-3.6-23.45a28 28 0 0 0 18.32-18.32a12 12 0 0 1 22.9 7.2ZM220 144a92 92 0 0 1-184 0c0-28.81 11.27-58.18 33.48-87.28a12 12 0 0 1 17.9-1.33l19.69 19.11L127 19.89a12 12 0 0 1 18.94-5.12C168.2 33.25 220 82.85 220 144m-24 0c0-41.71-30.61-78.39-52.52-99.29l-20.21 55.4a12 12 0 0 1-19.63 4.5L80.71 82.36C67 103.38 60 124.06 60 144a68 68 0 0 0 136 0"></path></svg> Cottura / attrezzatura</div>
            ${selectHtml('f-attrezz', 'Qualsiasi', ATTREZZ_ORDER, ATTREZZ_LABEL, state.filters.attrezz)}
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" id="clear-filters">Cancella filtri</button>
          <button class="btn is-solid mini-add-btn" data-close-filters>Applica</button>
        </div>
      </div>
    </div>` : '';

  const totalCount = DATA.recipes.length + Object.keys(state.customRecipes).length;

  const newRecipeModal = state.newRecipeModalOpen ? `
    <div class="filters-modal-backdrop" data-close-new-recipe-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Nuova ricetta</h3>
          <button class="btn is-icon filters-close-btn" data-close-new-recipe-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nome</div>
            <input type="text" id="new-recipe-name" placeholder="Es. Pasta al pesto">
          </div>
        </div>
        ${state.newRecipeError ? `<p class="section-sub" style="color:var(--tomato); margin-top:-8px;">${escapeHtml(state.newRecipeError)}</p>` : ''}
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" data-close-new-recipe-modal>Annulla</button>
          <button class="btn is-solid mini-add-btn" id="new-recipe-create-btn" type="button">Crea</button>
        </div>
      </div>
    </div>` : '';

  return `
    <h2 class="section-title">Ricettario</h2>
    <p class="section-sub">${totalCount} ricette — tocca una ricetta per vedere gli ingredienti</p>
    <div class="filters">
      <input type="search" id="f-search" placeholder="Cerca ricetta…" value="${escapeAttr(state.filters.search)}">
      <button class="btn" data-open-filters><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z"></path></svg>Filtri${activeCount ? ` (${activeCount})` : ''}</button>
    </div>
    ${filtersModal}
    <div class="recipe-count">${list.length} ricette trovate</div>
    <div class="recipe-list">${cards || '<p style="color:var(--sage);font-size:13px;">Nessuna ricetta corrisponde ai filtri.</p>'}</div>
    ${renderRecipeEditModal()}
    ${newRecipeModal}
    <button class="btn is-solid is-icon fab" id="prep-fab" type="button" aria-label="Aggiungi ricetta"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>
  `;
}

// Stesso schema icona+testo del bottone "Mangiata/Da mangiare" in Menù,
// riusato per il flag staple così i due toggle si comportano allo stesso modo.
function stapleToggleInner(active){
  return active
    ? '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fe" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"></path></svg> Di solito c\'è'
    : '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 5v14H5V5zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"></path></svg> Non sempre in casa';
}

function renderDispensa(){
  // Un'unica lista per dispensa/ripostiglio/frigo/freezer, distinti solo
  // dall'icona del luogo (si cambia toccandola). Si riempie da sola quando
  // si spunta un articolo in Spesa, e si modifica liberamente a mano. Una
  // voce senza quantità (0) non compare: la quantità è un contatore che si
  // vede solo una volta impostato.
  const items = Object.entries(state.pantryItems)
    .map(([key, it])=>({ key, nome: it.nome, qty: it.qty, unit: it.unit || '', luogo: it.luogo || 'dispensa', cat: it.cat }))
    .filter(it => typeof it.qty === 'number' && it.qty > 0);

  function itemRow(it){
    const editing = state.pantryEditingKey === it.key;
    const step = qtyStepFor(it.unit);
    return `
    <div class="inv-item">
      <button class="btn is-icon luogo-picker-opt is-selected" data-luogo-value="${escapeAttr(LUOGO_LABEL[it.luogo])}" data-luogo-toggle="${escapeAttr(it.key)}" type="button" title="Luogo: ${escapeAttr(LUOGO_LABEL[it.luogo])} — tocca per scegliere">${LUOGO_ICON[it.luogo]}</button>
      ${state.pantryLuogoPicker === it.key ? `
      <div class="luogo-picker-backdrop" data-luogo-picker-close></div>
      <div class="luogo-picker">
        ${LUOGO_ORDER.map(l=>`<button type="button" class="btn is-icon luogo-picker-opt${l===it.luogo?' active':''}" data-luogo-set="${escapeAttr(it.key)}" data-luogo-value="${l}" title="${escapeAttr(LUOGO_LABEL[l])}">${LUOGO_ICON[l]}</button>`).join('')}
      </div>` : ''}
      <button class="btn is-text inv-name" data-pantry-edit="${escapeAttr(it.key)}" type="button">${escapeHtml(it.nome)}</button>
      <span class="qty-stepper">
        <button class="qty-btn" type="button" data-qty-dec="${escapeAttr(it.key)}" aria-label="Diminuisci">−</button>
        ${editing
          ? `<input type="number" min="0" step="${step}" class="qty-input" value="${it.qty}" data-qty-edit="${escapeAttr(it.key)}">`
          : `<span class="qty-num${it.qty <= 1 ? ' low' : ''}" data-qty-show="${escapeAttr(it.key)}">${it.qty}${it.unit ? ' '+escapeHtml(it.unit) : ''}</span>`}
        <button class="qty-btn" type="button" data-qty-inc="${escapeAttr(it.key)}" aria-label="Aumenta">+</button>
      </span>
      <button class="btn-remove" data-inv-remove="${escapeAttr(it.key)}" type="button" aria-label="Elimina ${escapeAttr(it.nome)}"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0m48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0"></path></svg></button>
    </div>`;
  }

  let body;
  if(!items.length){
    body = `<p class="ing-empty">Vuota per ora — spunta qualcosa in Spesa o tocca il + per aggiungere un ingrediente.</p>`;
  } else if(state.pantryView === 'luogo'){
    const byLuogo = {};
    items.forEach(it=>{ (byLuogo[it.luogo] = byLuogo[it.luogo] || []).push(it); });
    body = LUOGO_ORDER.filter(l=>byLuogo[l] && byLuogo[l].length).map(l=>`
      <div class="dept-block">
        <div class="dept-title"><span class="dept-icon">${LUOGO_ICON[l]}</span>${LUOGO_LABEL[l]}</div>
        ${byLuogo[l].sort((a,b)=>a.nome.localeCompare(b.nome,'it')).map(itemRow).join('')}
      </div>`).join('');
  } else {
    const byDept = {};
    items.forEach(it=>{ const d = it.cat || classifyDept(it.nome); (byDept[d] = byDept[d] || []).push(it); });
    body = DEPT_ORDER.filter(d=>byDept[d] && byDept[d].length).map(d=>`
      <div class="dept-block">
        <div class="dept-title"><span class="dept-icon">${DEPT_ICON[d]}</span>${DEPT_LABEL[d]}</div>
        ${byDept[d].sort((a,b)=>a.nome.localeCompare(b.nome,'it')).map(itemRow).join('')}
      </div>`).join('');
  }

  const editItem = state.pantryEditKey ? state.pantryItems[state.pantryEditKey] : null;
  const editModal = editItem ? `
    <div class="filters-modal-backdrop" data-close-pantry-edit>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Modifica ingrediente</h3>
          <button class="btn is-icon filters-close-btn" data-close-pantry-edit>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Nome</div>
            <input type="text" id="pantry-edit-name" value="${escapeAttr(editItem.nome)}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Categoria</div>
            <select id="pantry-edit-cat">
              <option value="">Automatica (${escapeHtml(DEPT_LABEL[classifyDept(editItem.nome)])})</option>
              ${DEPT_ORDER.filter(d=>d!=='finiti').map(d=>`<option value="${d}" ${editItem.cat===d?'selected':''}>${DEPT_ICON[d]} ${escapeHtml(DEPT_LABEL[d])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Luogo</div>
            <select id="pantry-edit-luogo">
              ${LUOGO_ORDER.map(l=>`<option value="${l}" ${(editItem.luogo||'dispensa')===l?'selected':''}>${LUOGO_ICON[l]} ${escapeHtml(LUOGO_LABEL[l])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Quantità</div>
            <input type="number" min="0" step="${qtyStepFor(editItem.unit)}" id="pantry-edit-qty" value="${editItem.qty}">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Unità (per confrontare con quanto serve in ricetta)</div>
            <select id="pantry-edit-unit">
              ${UNIT_ORDER.map(u=>`<option value="${u}" ${(editItem.unit||'')===u?'selected':''}>${escapeHtml(UNIT_LABEL[u])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <button type="button" class="btn is-chip ${editItem.staple ? 'active' : ''}" id="pantry-edit-staple-toggle">${stapleToggleInner(!!editItem.staple)}</button>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" id="pantry-edit-delete">Elimina</button>
          <button class="btn is-solid mini-add-btn" data-close-pantry-edit>Chiudi</button>
        </div>
      </div>
    </div>` : '';

  const addModal = state.pantryAddModalOpen ? `
    <div class="filters-modal-backdrop" data-close-pantry-add-modal>
      <div class="filters-modal" data-stop-close>
        <div class="filters-modal-header">
          <h3>Aggiungi ingrediente</h3>
          <button class="btn is-icon filters-close-btn" data-close-pantry-add-modal>✕</button>
        </div>
        <div class="filter-groups">
          <div class="filter-group">
            <div class="filter-group-label">Ingrediente</div>
            <input type="text" id="pantry-add-name" placeholder="Nuovo ingrediente">
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Luogo</div>
            <select id="pantry-add-luogo">
              ${LUOGO_ORDER.map(l=>`<option value="${l}">${LUOGO_ICON[l]} ${LUOGO_LABEL[l]}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <div class="filter-group-label">Unità (per confrontare con quanto serve in ricetta)</div>
            <select id="pantry-add-unit">
              ${UNIT_ORDER.map(u=>`<option value="${u}">${escapeHtml(UNIT_LABEL[u])}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <button type="button" class="btn is-chip" id="pantry-add-staple-toggle">${stapleToggleInner(false)}</button>
          </div>
        </div>
        <div class="filters-modal-footer">
          <button class="btn is-ghost reset-btn" data-close-pantry-add-modal>Annulla</button>
          <button class="btn is-solid mini-add-btn" id="pantry-add-btn" type="button">Aggiungi</button>
        </div>
      </div>
    </div>` : '';

  // Ingredienti a scorta 0: mai cancellati (vedi Spesa/"Finiti in Dispensa"),
  // qui restano fuori dalle viste normali per luogo/categoria e finiscono in un
  // accordion a parte, chiuso di default — non è un luogo assegnabile, solo
  // uno stato. Riusa itemRow: stesso stepper/edit/luogo-picker degli altri.
  const finishedItems = Object.entries(state.pantryItems)
    .map(([key, it])=>({ key, nome: it.nome, qty: it.qty, unit: it.unit || '', luogo: it.luogo || 'dispensa', cat: it.cat }))
    .filter(it => typeof it.qty === 'number' && it.qty <= 0)
    .sort((a,b)=>a.nome.localeCompare(b.nome,'it'));
  const finishedSection = finishedItems.length ? `
    <div class="dept-block">
      <div class="dept-title finished-toggle${state.pantryFinishedOpen ? ' open' : ''}" data-toggle-finished>
        <span class="dept-icon">${DEPT_ICON.finiti}</span>${DEPT_LABEL.finiti} (${finishedItems.length})
        <svg class="finished-chevron" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 256 256"><path fill="currentColor" d="m213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32"></path></svg>
      </div>
      ${state.pantryFinishedOpen ? finishedItems.map(itemRow).join('') : ''}
    </div>` : '';

  return `
    <h2 class="section-title">Dispensa</h2>
    <p class="section-sub">Si aggiorna da sola quando spunti qualcosa in Spesa — aggiungi o togli a mano quello che manca</p>
    <div class="view-toggle">
      <button class="view-btn ${state.pantryView!=='luogo'?'active':''}" data-pantry-view="categoria">Per categoria</button>
      <button class="view-btn ${state.pantryView==='luogo'?'active':''}" data-pantry-view="luogo">Per luogo</button>
    </div>
    ${body}
    ${finishedSection}
    <div class="save-hint"></div>
    ${editModal}
    ${addModal}
    <button class="btn is-solid is-icon fab" id="dispensa-fab" type="button" aria-label="Aggiungi ingrediente"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ph" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 256"><path fill="currentColor" d="M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12"></path></svg></button>
  `;
}

function escapeHtml(s){ if(s===undefined || s===null) return ''; return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHtml(s); }
// Per le label che possono contenere un'icona SVG (es. FREEZER_LABEL) usate in
// contesti solo-testo come <option>, dove un tag non può comunque comparire
// come icona: toglie il markup invece di mostrarlo come testo illeggibile.
function stripHtml(s){ return (s||'').replace(/<[^>]*>/g, '').trim(); }

function attachHandlers(){
  document.querySelectorAll('[data-shop-view]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.shopView = e.target.dataset.shopView;
      render();
    });
  });

  document.querySelectorAll('.shop-item input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', e=>{
      // La spunta segna solo "preso/da tenere d'occhio": non tocca la Dispensa.
      // È "Elimina spuntati" (per quello che avevi già) o "Sposta in dispensa"
      // (per quello appena comprato) a decidere cosa succede a quello spuntato.
      e.target.dataset.shopKeys.split(',').forEach(k=>{ state.shopChecked[k] = e.target.checked; });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-qty-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.shopQtyInc;
      const current = (typeof state.shopQty[key] === 'number') ? state.shopQty[key] : 1;
      state.shopQty[key] = current + 1;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.shopQtyDec;
      const current = (typeof state.shopQty[key] === 'number') ? state.shopQty[key] : 1;
      state.shopQty[key] = Math.max(1, current - 1);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-qty-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.shopQtyEditingKey = e.currentTarget.dataset.shopQtyShow;
      render();
    });
  });
  const shopQtyEditInput = document.querySelector('[data-shop-qty-edit]');
  if(shopQtyEditInput){
    shopQtyEditInput.focus();
    shopQtyEditInput.select();
    const commitShopQtyEdit = ()=>{
      const key = shopQtyEditInput.dataset.shopQtyEdit;
      const n = parseInt(shopQtyEditInput.value, 10);
      state.shopQty[key] = Number.isNaN(n) ? 1 : Math.max(1, n);
      state.shopQtyEditingKey = null;
      persist(); render();
    };
    shopQtyEditInput.addEventListener('blur', commitShopQtyEdit);
    shopQtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') shopQtyEditInput.blur(); });
  }
  const deleteCheckedBtn = document.getElementById('delete-checked-shop');
  if(deleteCheckedBtn){
    // Per quello che era già spuntato perché ce l'hai già (basilare o
    // aggiornato a mano): esce dalla lista senza toccare la Dispensa.
    deleteCheckedBtn.addEventListener('click', ()=>{
      document.querySelectorAll('.shop-item input[type=checkbox]:checked').forEach(cb=>{
        if(cb.closest('.finished-shop-group')) return;
        cb.dataset.shopKeys.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
      });
      persist(); render();
    });
  }
  const moveToPantryBtn = document.getElementById('move-checked-to-pantry');
  if(moveToPantryBtn){
    // Per quello che hai appena comprato: aggiunge alla Dispensa (con la
    // quantità impostata nello stepper) e poi esce dalla lista.
    moveToPantryBtn.addEventListener('click', ()=>{
      document.querySelectorAll('.shop-item input[type=checkbox]:checked').forEach(cb=>{
        if(cb.closest('.finished-shop-group')) return;
        const rowKey = cb.dataset.shopKeys;
        const qty = (typeof state.shopQty[rowKey] === 'number') ? state.shopQty[rowKey] : 1;
        upsertPantryItem(cb.dataset.shopName, 'dispensa', qty);
        rowKey.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
      });
      persist(); render();
    });
  }
  // Selezionati nella sezione "Finiti" (checkbox spuntata = presa in carico):
  // o si scartano (non li vuoi comprare ora) o si "promuovono" nel loro
  // reparto vero, mescolandosi alle sezioni normali sopra invece di restare
  // isolati nel blocco Finiti (vedi il flag "confirmed" in renderSpesa).
  document.querySelectorAll('[data-finished-shop-delete]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.finished-shop-group input[type=checkbox]:checked').forEach(cb=>{
        cb.dataset.shopKeys.split(',').forEach(k=>{ state.shopDismissed[k] = true; });
      });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-finished-shop-addlist]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.finished-shop-group input[type=checkbox]:checked').forEach(cb=>{
        cb.dataset.shopKeys.split(',').forEach(k=>{
          if(k.startsWith('oos_')) state.pantryConfirmedShop[k.slice(4)] = true;
        });
      });
      persist(); render();
    });
  });
  document.querySelectorAll('[data-shop-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.currentTarget.dataset.shopRemove.split(',').forEach(k=>{
        if(state.shopExtras[k]) delete state.shopExtras[k];
        else state.shopDismissed[k] = true;
      });
      persist(); render();
    });
  });
  const shopAddBtn = document.getElementById('shop-add-btn');
  if(shopAddBtn){
    const nameInput = document.getElementById('shop-add-name');
    const qtaInput = document.getElementById('shop-add-qta');
    const doAdd = ()=>{
      if(!nameInput.value.trim()) return;
      const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
      state.shopExtras[id] = { ingrediente: nameInput.value.trim(), qta: qtaInput.value.trim() };
      state.addIngModalOpen = false;
      persist(); render();
    };
    shopAddBtn.addEventListener('click', doAdd);
    [nameInput, qtaInput].forEach(inp=>{
      inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') doAdd(); });
    });
  }
  const spesaFab = document.getElementById('spesa-fab');
  if(spesaFab) spesaFab.addEventListener('click', ()=>{ state.addIngModalOpen = true; render(); });
  document.querySelectorAll('[data-close-add-ing-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.addIngModalOpen = false;
      render();
    });
  });
  const resetBtn = document.getElementById('reset-shop');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{ state.shopChecked = {}; state.shopDismissed = {}; persist(); render(); });

  document.querySelectorAll('[data-open-swap]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.target.dataset.openSwap;
      state.swapOpenDay = state.swapOpenDay === key ? null : key;
      state.linkPickerOpenDay = null;
      render();
    });
  });
  document.querySelectorAll('[data-open-link-picker]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.openLinkPicker;
      state.linkPickerOpenDay = state.linkPickerOpenDay === key ? null : key;
      state.swapOpenDay = null;
      render();
    });
  });
  document.querySelectorAll('[data-link-pick]').forEach(row=>{
    row.addEventListener('click', e=>{
      const el = e.currentTarget;
      const sourceKey = el.dataset.linkDay; // giorno in cui è stata cucinata (dove hai cliccato "È avanzata")
      const targetKey = el.dataset.linkPick; // giorno scelto in cui la mangerete
      const [w,i] = targetKey.split('_');
      const weekIdx = parseInt(w,10);
      state.dayLinks[targetKey] = sourceKey;
      delete weekOverridesRef(weekIdx)[i];
      delete weekOverridePickedRef(weekIdx)[i];
      delete weekMealsDoneRef(weekIdx)[i];
      state.linkPickerOpenDay = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-unlink-day]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      clearDayLink(e.currentTarget.dataset.unlinkDay);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-link-note]').forEach(inp=>{
    const commit = e=>{
      const key = e.target.dataset.linkNote;
      const val = e.target.value.trim();
      if(val) state.dayLinkNotes[key] = val; else delete state.dayLinkNotes[key];
      persist();
    };
    inp.addEventListener('blur', commit);
    inp.addEventListener('keydown', e=>{ if(e.key === 'Enter') e.target.blur(); });
  });
  document.querySelectorAll('[data-drag-handle]').forEach(handle=>{
    handle.addEventListener('pointerdown', startDayDrag);
  });
  document.querySelectorAll('[data-toggle-cook]').forEach(btn=>{
    btn.addEventListener('click', e=>{ toggleCook(e.currentTarget.dataset.toggleCook); });
  });
  document.querySelectorAll('[data-portions-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const dayKey = e.currentTarget.dataset.portionsInc;
      const [w,i] = dayKey.split('_');
      const det = getRecipeDetails(effectiveRecipeName(parseInt(w,10), i));
      const base = det ? parsePortionsBase(det.porzioni) : null;
      const current = state.dayPortions[dayKey] || base || 1;
      state.dayPortions[dayKey] = current + 1;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-portions-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const dayKey = e.currentTarget.dataset.portionsDec;
      const [w,i] = dayKey.split('_');
      const det = getRecipeDetails(effectiveRecipeName(parseInt(w,10), i));
      const base = det ? parsePortionsBase(det.porzioni) : null;
      const current = state.dayPortions[dayKey] || base || 1;
      state.dayPortions[dayKey] = Math.max(1, current - 1);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-toggle-assignee]').forEach(btn=>{
    btn.addEventListener('click', e=>{ toggleShopAssignee(e.currentTarget.dataset.toggleAssignee); });
  });
  document.querySelectorAll('[data-go-tab]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.tab = e.currentTarget.dataset.goTab;
      window.location.hash = state.tab;
      render();
    });
  });
  document.querySelectorAll('[data-mancanti-in-spesa]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const recipeName = e.currentTarget.dataset.mancantiInSpesa;
      const ratio = parseFloat(e.currentTarget.dataset.mancantiRatio) || 1;
      getIngredientsFor(recipeName).filter(it => pantryStatusFor(it.ingrediente, scaleQtyText(it.qta, ratio)) !== 'in-casa').forEach(it=>{
        const already = Object.values(state.shopExtras).some(x => x.ingrediente.trim().toLowerCase() === it.ingrediente.trim().toLowerCase());
        if(already) return;
        const id = 'extra_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
        state.shopExtras[id] = { ingrediente: it.ingrediente, qta: scaleQtyText(it.qta, ratio) || '' };
      });
      state.tab = 'spesa';
      window.location.hash = 'spesa';
      persist(); render();
    });
  });
  document.querySelectorAll('[data-generate-week]').forEach(btn=>{
    btn.addEventListener('click', e=>{ generateWeek(parseInt(e.currentTarget.dataset.generateWeek,10)); });
  });
  document.querySelectorAll('[data-remove-week]').forEach(btn=>{
    btn.addEventListener('click', e=>{ removeWeek(parseInt(e.currentTarget.dataset.removeWeek,10)); });
  });
  const addWeekBtn = document.getElementById('add-week');
  if(addWeekBtn) addWeekBtn.addEventListener('click', ()=>{ addWeek(); });

  document.querySelectorAll('[data-open-gen-settings]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.genSettingsOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-gen-settings]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.genSettingsOpen = false;
      render();
    });
  });
  document.querySelectorAll('[data-dismiss-reminder]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.notifDismissed[e.currentTarget.dataset.dismissReminder] = true;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-dismiss-eaten-reminder]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.mealsDoneReminderDismissed[e.currentTarget.dataset.dismissEatenReminder] = true;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-tempo-cap-day]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const day = parseInt(e.currentTarget.dataset.tempoCapDay, 10);
      const level = e.currentTarget.dataset.tempoCapLevel;
      state.dayTempoCap[day] = level;
      persist(); render();
    });
  });

  document.querySelectorAll('[data-reset-swap]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.target.dataset.resetSwap;
      const [w,i] = key.split('_');
      const weekIdx = parseInt(w,10);
      delete weekOverridesRef(weekIdx)[i];
      delete weekOverridePickedRef(weekIdx)[i];
      delete weekMealsDoneRef(weekIdx)[i];
      clearDayLink(key);
      unlinkDaysPointingTo(key);
      state.swapOpenDay = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-swap-cat]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = e.target.dataset.swapDay;
      if(!state.swapFilters[i]) state.swapFilters[i] = {search:'', cat:'same'};
      state.swapFilters[i].cat = e.target.dataset.swapCat;
      render();
    });
  });
  document.querySelectorAll('[data-swap-search]').forEach(inp=>{
    inp.addEventListener('input', e=>{
      const i = e.target.dataset.swapSearch;
      if(!state.swapFilters[i]) state.swapFilters[i] = {search:'', cat:'same'};
      state.swapFilters[i].search = e.target.value;
      render();
      const el = document.querySelector(`[data-swap-search="${i}"]`);
      if(el){ el.focus(); el.selectionStart = el.value.length; }
    });
  });
  document.querySelectorAll('[data-swap-pick]').forEach(row=>{
    row.addEventListener('click', e=>{
      const el = e.currentTarget;
      const key = el.dataset.swapDay;
      const [w,i] = key.split('_');
      const weekIdx = parseInt(w,10);
      const recipeName = el.dataset.swapPick;
      weekOverridesRef(weekIdx)[i] = recipeName;
      weekOverridePickedRef(weekIdx)[i] = true;
      delete weekMealsDoneRef(weekIdx)[i];
      clearDayLink(key);
      unlinkDaysPointingTo(key);
      state.swapOpenDay = null;
      persist(); render();
    });
  });

  document.querySelectorAll('[data-toggle-done]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.toggleDone;
      const [w,i] = key.split('_');
      const weekIdx = parseInt(w,10);
      const mealsDone = weekMealsDoneRef(weekIdx);
      if(mealsDone[i]){
        delete mealsDone[i];
        persist(); render();
      } else if(linkedSourceDayKey(weekIdx, i)){
        // giorno "avanzo": nessun nuovo ingrediente consumato (già scalato sul
        // giorno sorgente), quindi si segna direttamente senza passare dalla
        // modale di aggiornamento Dispensa.
        mealsDone[i] = true;
        persist(); render();
      } else {
        const recipeName = effectiveRecipeName(weekIdx, i);
        const qtyMap = {};
        getIngredientsFor(recipeName).forEach(it=>{
          const pantryKey = (it.ingrediente||'').trim().toLowerCase();
          const pantryIt = state.pantryItems[pantryKey];
          if(pantryIt && typeof pantryIt.qty === 'number') qtyMap[it.ingrediente] = pantryIt.qty;
        });
        state.doneModalDay = key;
        state.doneModalQty = qtyMap;
        render();
      }
    });
  });
  document.querySelectorAll('[data-close-done-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.doneModalDay = null;
      state.doneModalQty = {};
      render();
    });
  });
  document.querySelectorAll('[data-done-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.doneQtyDec;
      state.doneModalQty[name] = Math.max(0, (state.doneModalQty[name]||0) - 1);
      render();
    });
  });
  document.querySelectorAll('[data-done-qty-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.doneQtyInc;
      state.doneModalQty[name] = (state.doneModalQty[name]||0) + 1;
      render();
    });
  });
  document.querySelectorAll('[data-confirm-done]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.confirmDone;
      const [w,i] = key.split('_');
      const qtyMap = state.doneModalQty || {};
      Object.keys(qtyMap).forEach(ingrediente=>{
        const pantryKey = ingrediente.trim().toLowerCase();
        if(state.pantryItems[pantryKey]) state.pantryItems[pantryKey].qty = qtyMap[ingrediente];
      });
      weekMealsDoneRef(parseInt(w,10))[i] = true;
      state.doneModalDay = null;
      state.doneModalQty = {};
      persist(); render();
    });
  });

  document.querySelectorAll('[data-toggle-day]').forEach(el=>{
    el.addEventListener('click', e=>{
      const key = e.target.dataset.toggleDay;
      const opening = state.expandedDay !== key;
      state.expandedDay = opening ? key : null;
      render();
      if(opening){
        const menuEl = document.querySelector(`[data-toggle-day="${CSS.escape(key)}"]`);
        const card = menuEl ? menuEl.closest('.day-card') : null;
        if(card){
          // la topbar è sticky: scrollIntoView da solo nasconderebbe l'inizio
          // della card sotto di lei, quindi calcolo l'offset a mano (come in Ricette).
          const topbar = document.querySelector('.topbar');
          const offset = (topbar ? topbar.offsetHeight : 0) + 8;
          const top = card.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });
  document.querySelectorAll('[data-scroll-to-day]').forEach(el=>{
    el.addEventListener('click', e=>{
      const [w, i] = e.currentTarget.dataset.scrollToDay.split('_');
      // Solo colpo d'occhio nella striscia: i giorni già passati non hanno una
      // card visibile (vedi startPos in renderWeekSection), il tap non fa nulla.
      const card = document.querySelector(`.day-card[data-week-idx="${CSS.escape(w)}"][data-day-index="${CSS.escape(i)}"]`);
      if(!card) return;
      const topbar = document.querySelector('.topbar');
      const offset = (topbar ? topbar.offsetHeight : 0) + 8;
      const top = card.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-add-ing]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.target.dataset.addIng;
      const nameInput = document.querySelector(`[data-ning="${key}"]`);
      const qtaInput = document.querySelector(`[data-nqta="${key}"]`);
      const ingrediente = nameInput.value.trim();
      const qta = qtaInput.value.trim();
      if(!ingrediente) return;
      const [w,i] = key.split('_');
      const recipeName = effectiveRecipeName(parseInt(w,10), i);
      if(!state.recipeIngredients[recipeName]) state.recipeIngredients[recipeName] = [];
      state.recipeIngredients[recipeName].push({ingrediente, qta, dove:'', note:''});
      persist(); render();
      state.expandedDay = key;
    });
  });

  document.querySelectorAll('[data-toggle-recipe]').forEach(el=>{
    el.addEventListener('click', e=>{
      const name = el.dataset.toggleRecipe;
      const opening = state.expandedRecipe !== name;
      state.expandedRecipe = opening ? name : null;
      render();
      if(opening){
        const card = document.querySelector(`[data-toggle-recipe="${CSS.escape(name)}"]`);
        if(card){
          // la topbar è sticky: scrollIntoView da solo nasconderebbe l'inizio
          // della card sotto di lei, quindi calcolo l'offset a mano.
          const topbar = document.querySelector('.topbar');
          const offset = (topbar ? topbar.offsetHeight : 0) + 8;
          const top = card.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  document.querySelectorAll('[data-add-ing-recipe]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const recipeName = e.target.dataset.addIngRecipe;
      const nameInput = document.querySelector(`[data-rning="${CSS.escape(recipeName)}"]`);
      const qtaInput = document.querySelector(`[data-rnqta="${CSS.escape(recipeName)}"]`);
      const ingrediente = nameInput.value.trim();
      const qta = qtaInput.value.trim();
      if(!ingrediente) return;
      if(!state.recipeIngredients[recipeName]) state.recipeIngredients[recipeName] = [];
      state.recipeIngredients[recipeName].push({ingrediente, qta, dove:'', note:''});
      persist(); render();
    });
  });

  document.querySelectorAll('[data-open-recipe-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.recipeEditName = e.currentTarget.dataset.openRecipeEdit;
      render();
    });
  });
  document.querySelectorAll('[data-close-recipe-edit]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.recipeEditName = null;
      render();
    });
  });
  const recipeEditModal = document.querySelector('.recipe-edit-modal');
  if(recipeEditModal){
    // Aggiungere/rimuovere righe o attivare una stagione non richiede un render
    // completo: si manipola solo il DOM del form, per non perdere il testo che
    // si sta scrivendo negli altri campi (a differenza del resto dell'app, che
    // ri-renderizza tutto a ogni modifica).
    recipeEditModal.addEventListener('click', e=>{
      if(e.target.closest('[data-remove-row]')){
        e.target.closest('.edit-ing-row, .edit-step-row').remove();
        return;
      }
      const stagioneChip = e.target.closest('[data-stagione-chip]');
      if(stagioneChip){
        stagioneChip.classList.toggle('active');
        return;
      }
      if(e.target.closest('#edit-add-ing-row')){
        document.getElementById('edit-ing-list').insertAdjacentHTML('beforeend', editIngRowHtml('', ''));
        return;
      }
      if(e.target.closest('#edit-add-step-row')){
        document.getElementById('edit-step-list').insertAdjacentHTML('beforeend', editStepRowHtml(''));
        return;
      }
    });
  }
  document.querySelectorAll('[data-save-recipe-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.saveRecipeEdit;
      const ingredienti = Array.from(document.querySelectorAll('#edit-ing-list .edit-ing-row')).map(row=>({
        ingrediente: row.querySelector('.edit-ing-name').value.trim(),
        qta: row.querySelector('.edit-ing-qta').value.trim()
      })).filter(it=>it.ingrediente);
      const procedimento = Array.from(document.querySelectorAll('#edit-step-list .edit-step-text'))
        .map(el=>el.value.trim()).filter(Boolean);
      const stagioni = Array.from(document.querySelectorAll('#edit-stagioni [data-stagione-chip].active'))
        .map(el=>el.dataset.stagioneChip);
      state.recipeEdits[name] = {
        tempo: document.getElementById('edit-tempo').value.trim(),
        tempoBucket: document.getElementById('edit-tempo-bucket').value,
        porzioni: document.getElementById('edit-porzioni').value.trim(),
        categoriaNew: document.getElementById('edit-categoria').value,
        stagioni: stagioni.length ? stagioni : ['tutto'],
        freezerNew: document.getElementById('edit-freezer-new').value,
        avanziNew: document.getElementById('edit-avanzi-new').value,
        pianificazione: document.getElementById('edit-pianificazione').value,
        ingredienti,
        procedimento,
        ricordare: document.getElementById('edit-ricordare').value.trim(),
        avanzi: document.getElementById('edit-avanzi-note').value.trim(),
        freezer: document.getElementById('edit-freezer-note').value.trim(),
        link: document.getElementById('edit-link').value.trim()
      };
      state.recipeEditName = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-delete-recipe]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.currentTarget.dataset.deleteRecipe;
      delete state.recipeEdits[name];
      delete state.recipeIngredients[name];
      if(state.customRecipes[name]) delete state.customRecipes[name];
      else state.hiddenRecipes[name] = true;
      if(state.expandedRecipe === name) state.expandedRecipe = null;
      state.recipeEditName = null;
      persist(); render();
    });
  });

  document.querySelectorAll('[data-open-filters]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.filtersOpen = true; render(); });
  });
  document.querySelectorAll('[data-close-filters]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.filtersOpen = false; render();
    });
  });
  const stopClose = document.querySelector('[data-stop-close]');
  if(stopClose) stopClose.addEventListener('click', e=>{ e.stopPropagation(); });
  const clearFilters = document.getElementById('clear-filters');
  if(clearFilters) clearFilters.addEventListener('click', ()=>{
    state.filters = { cat:[], tempo:'', pian:'', stagione:'', avanzi:'', freezer:'', grad:'', attrezz:'', search: state.filters.search };
    render();
  });

  const prepFab = document.getElementById('prep-fab');
  if(prepFab) prepFab.addEventListener('click', ()=>{ state.newRecipeModalOpen = true; state.newRecipeError = ''; render(); });
  document.querySelectorAll('[data-close-new-recipe-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.newRecipeModalOpen = false;
      state.newRecipeError = '';
      render();
    });
  });
  const newRecipeCreateBtn = document.getElementById('new-recipe-create-btn');
  if(newRecipeCreateBtn){
    const nameInput = document.getElementById('new-recipe-name');
    const doCreate = ()=>{
      const name = nameInput.value.trim();
      if(!name){ state.newRecipeError = 'Inserisci un nome.'; render(); return; }
      const nameLower = name.toLowerCase();
      const exists = Object.keys(recipeByName).some(n=>n.toLowerCase()===nameLower)
        || Object.keys(state.customRecipes).some(n=>n.toLowerCase()===nameLower);
      if(exists){ state.newRecipeError = 'Esiste già una ricetta con questo nome.'; render(); return; }
      state.customRecipes[name] = { nome: name };
      state.newRecipeModalOpen = false;
      state.newRecipeError = '';
      state.recipeEditName = name;
      persist(); render();
    };
    newRecipeCreateBtn.addEventListener('click', doCreate);
    nameInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doCreate(); });
  }

  const fSearch = document.getElementById('f-search');
  if(fSearch) fSearch.addEventListener('input', e=>{ state.filters.search = e.target.value; render(); const el=document.getElementById('f-search'); el.focus(); el.selectionStart = el.value.length; });

  document.querySelectorAll('.chip-row [data-f]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const f = e.target.dataset.f, v = e.target.dataset.v;
      state.filters[f] = v;
      render();
    });
  });
  // Categoria: multi-selezione, a differenza degli altri filtri (un solo valore).
  document.querySelectorAll('[data-cat-chip]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const c = e.currentTarget.dataset.catChip;
      const idx = state.filters.cat.indexOf(c);
      if(idx === -1) state.filters.cat.push(c); else state.filters.cat.splice(idx, 1);
      render();
    });
  });
  document.querySelectorAll('[data-cat-clear]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ state.filters.cat = []; render(); });
  });
  [['f-tempo','tempo'],['f-pian','pian'],['f-stagione','stagione'],['f-avanzi','avanzi'],['f-freezer','freezer'],['f-grad','grad'],['f-attrezz','attrezz']].forEach(([id,key])=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('change', e=>{ state.filters[key] = e.target.value; render(); });
  });

  document.querySelectorAll('[data-pantry-view]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.pantryView = e.target.dataset.pantryView;
      render();
    });
  });
  document.querySelectorAll('[data-toggle-finished]').forEach(el=>{
    el.addEventListener('click', ()=>{
      state.pantryFinishedOpen = !state.pantryFinishedOpen;
      render();
    });
  });
  document.querySelectorAll('[data-luogo-toggle]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.luogoToggle;
      state.pantryLuogoPicker = state.pantryLuogoPicker === key ? null : key;
      render();
    });
  });
  document.querySelectorAll('[data-luogo-picker-close]').forEach(el=>{
    el.addEventListener('click', ()=>{ state.pantryLuogoPicker = null; render(); });
  });
  document.querySelectorAll('[data-luogo-set]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const it = state.pantryItems[e.currentTarget.dataset.luogoSet];
      if(it) it.luogo = e.currentTarget.dataset.luogoValue;
      state.pantryLuogoPicker = null;
      persist(); render();
    });
  });
  document.querySelectorAll('[data-qty-inc]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const key = e.currentTarget.dataset.qtyInc;
      const it = state.pantryItems[key];
      if(!it) return;
      const step = qtyStepFor(it.unit);
      it.qty = Math.round(((typeof it.qty === 'number' ? it.qty : 0) + step) * 100) / 100;
      if(it.qty > 0) delete state.pantryConfirmedShop[key];
      persist(); render();
    });
  });
  document.querySelectorAll('[data-qty-dec]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const it = state.pantryItems[e.currentTarget.dataset.qtyDec];
      if(!it) return;
      const step = qtyStepFor(it.unit);
      it.qty = Math.max(0, Math.round(((typeof it.qty === 'number' ? it.qty : 0) - step) * 100) / 100);
      persist(); render();
    });
  });
  document.querySelectorAll('[data-qty-show]').forEach(el=>{
    el.addEventListener('click', e=>{
      state.pantryEditingKey = e.currentTarget.dataset.qtyShow;
      render();
    });
  });
  const qtyEditInput = document.querySelector('[data-qty-edit]');
  if(qtyEditInput){
    qtyEditInput.focus();
    qtyEditInput.select();
    const commitQtyEdit = ()=>{
      const key = qtyEditInput.dataset.qtyEdit;
      const it = state.pantryItems[key];
      if(it){
        const n = parseFloat(qtyEditInput.value);
        it.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
        if(it.qty > 0) delete state.pantryConfirmedShop[key];
      }
      state.pantryEditingKey = null;
      persist(); render();
    };
    qtyEditInput.addEventListener('blur', commitQtyEdit);
    qtyEditInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') qtyEditInput.blur(); });
  }
  document.querySelectorAll('[data-inv-remove]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      delete state.pantryItems[e.currentTarget.dataset.invRemove];
      persist(); render();
    });
  });
  const pantryAddBtn = document.getElementById('pantry-add-btn');
  if(pantryAddBtn){
    const nameInput = document.getElementById('pantry-add-name');
    const luogoSelect = document.getElementById('pantry-add-luogo');
    const stapleToggle = document.getElementById('pantry-add-staple-toggle');
    const unitSelect = document.getElementById('pantry-add-unit');
    const doAdd = ()=>{
      if(!nameInput.value.trim()) return;
      upsertPantryItem(nameInput.value, luogoSelect.value, undefined, stapleToggle && stapleToggle.classList.contains('active'), unitSelect ? unitSelect.value : '');
      state.pantryAddModalOpen = false;
      persist(); render();
    };
    pantryAddBtn.addEventListener('click', doAdd);
    nameInput.addEventListener('keydown', e=>{ if(e.key === 'Enter') doAdd(); });
    // Non chiama render(): altrimenti il testo già digitato nel campo nome andrebbe perso.
    if(stapleToggle) stapleToggle.addEventListener('click', ()=>{
      const nowActive = !stapleToggle.classList.contains('active');
      stapleToggle.classList.toggle('active', nowActive);
      stapleToggle.innerHTML = stapleToggleInner(nowActive);
    });
  }
  const dispensaFab = document.getElementById('dispensa-fab');
  if(dispensaFab) dispensaFab.addEventListener('click', ()=>{ state.pantryAddModalOpen = true; render(); });
  document.querySelectorAll('[data-close-pantry-add-modal]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.pantryAddModalOpen = false;
      render();
    });
  });

  document.querySelectorAll('[data-pantry-edit]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.pantryEditKey = e.currentTarget.dataset.pantryEdit;
      render();
    });
  });
  document.querySelectorAll('[data-close-pantry-edit]').forEach(el=>{
    el.addEventListener('click', e=>{
      if(e.target.hasAttribute('data-stop-close')) return;
      state.pantryEditKey = null; render();
    });
  });
  const editNameInput = document.getElementById('pantry-edit-name');
  if(editNameInput){
    editNameInput.addEventListener('change', e=>{
      state.pantryEditKey = renamePantryItem(state.pantryEditKey, e.target.value);
      persist(); render();
    });
  }
  const editCatSelect = document.getElementById('pantry-edit-cat');
  if(editCatSelect){
    editCatSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        if(e.target.value) it.cat = e.target.value; else delete it.cat;
        persist(); render();
      }
    });
  }
  const editLuogoSelect = document.getElementById('pantry-edit-luogo');
  if(editLuogoSelect){
    editLuogoSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){ it.luogo = e.target.value; persist(); render(); }
    });
  }
  const editQtyInput = document.getElementById('pantry-edit-qty');
  if(editQtyInput){
    editQtyInput.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        const n = parseFloat(e.target.value);
        it.qty = Number.isNaN(n) ? 0 : Math.max(0, n);
        persist(); render();
      }
    });
  }
  const editUnitSelect = document.getElementById('pantry-edit-unit');
  if(editUnitSelect){
    editUnitSelect.addEventListener('change', e=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        if(e.target.value) it.unit = e.target.value; else delete it.unit;
        persist(); render();
      }
    });
  }
  const editStapleToggle = document.getElementById('pantry-edit-staple-toggle');
  if(editStapleToggle){
    editStapleToggle.addEventListener('click', ()=>{
      const it = state.pantryItems[state.pantryEditKey];
      if(it){
        it.staple = !it.staple;
        persist(); render();
      }
    });
  }
  const editDeleteBtn = document.getElementById('pantry-edit-delete');
  if(editDeleteBtn){
    editDeleteBtn.addEventListener('click', ()=>{
      delete state.pantryItems[state.pantryEditKey];
      state.pantryEditKey = null;
      persist(); render();
    });
  }
}

document.querySelectorAll('nav.tabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.tab = btn.dataset.tab;
    window.location.hash = state.tab;
    render();
  });
});

// Sposta di una posizione tra le tab (bordo escluso: niente giro su sé stesse).
function goToTab(delta){
  const idx = TAB_KEYS.indexOf(state.tab);
  const next = TAB_KEYS[Math.min(TAB_KEYS.length - 1, Math.max(0, idx + delta))];
  if(next !== state.tab){
    state.tab = next;
    window.location.hash = next;
    render();
  }
}

// Swipe orizzontale per cambiare tab, come in WhatsApp. Solo touch (è un gesto
// mobile): non intercetta il mouse, così non interferisce col drag&drop dei
// giorni nel Menù (che usa Pointer Events separatamente). Ignora i gesti che
// partono da elementi con un loro scroll orizzontale, campi di input o dentro
// una modale, per non rubargli il tocco.
(function(){
  const panel = document.getElementById('panel');
  if(!panel) return;
  const THRESHOLD = 60, MAX_VERTICAL = 60;
  let startX = 0, startY = 0, tracking = false;
  function shouldIgnore(target){
    return !!target.closest('.balance-strip, input, textarea, select, .drag-handle, .filters-modal-backdrop, .settings-backdrop, .luogo-picker, .luogo-picker-backdrop');
  }
  panel.addEventListener('touchstart', e=>{
    if(e.touches.length !== 1 || shouldIgnore(e.target)){ tracking = false; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });
  panel.addEventListener('touchend', e=>{
    if(!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if(Math.abs(dx) < THRESHOLD || Math.abs(dy) > MAX_VERTICAL) return;
    goToTab(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

(function(){
  const settingsBtn = document.getElementById('settings-btn');
  const settingsBackdrop = document.getElementById('settings-backdrop');
  const settingsClose = document.getElementById('settings-close');
  const profilePanel = document.getElementById('profile-panel');
  if(!settingsBtn || !settingsBackdrop) return;
  const open = ()=>{
    if(profilePanel) profilePanel.innerHTML = renderProfilePanel();
    settingsBackdrop.classList.add('open');
  };
  const close = ()=> settingsBackdrop.classList.remove('open');
  settingsBtn.addEventListener('click', open);
  if(settingsClose) settingsClose.addEventListener('click', close);
  settingsBackdrop.addEventListener('click', e=>{ if(e.target === settingsBackdrop) close(); });
  if(profilePanel){
    profilePanel.addEventListener('click', e=>{
      const swatch = e.target.closest('[data-user-color]');
      if(!swatch) return;
      const user = getCurrentUser();
      if(!user) return;
      state.userColors[user] = swatch.dataset.userColor;
      applyUserColors();
      persist();
      profilePanel.innerHTML = renderProfilePanel();
    });
  }
})();

// Drag&drop per scambiare le ricette di due giorni nel Menù (Pointer Events,
// non l'HTML5 drag&drop nativo: su mobile è quello che funziona in modo affidabile
// sia con dito che con mouse). dragState vive fuori da attachHandlers perché deve
// sopravvivere ai render intermedi; i listener su document vanno registrati una
// sola volta, mentre il pointerdown sull'handle viene ri-agganciato a ogni render
// (l'elemento viene ricreato ogni volta) da attachHandlers.
let dragState = null;
function startDayDrag(e){
  e.preventDefault();
  const card = e.currentTarget.closest('.day-card');
  if(!card) return;
  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  const recipeEl = card.querySelector('.day-menu');
  ghost.textContent = recipeEl ? recipeEl.textContent : '';
  document.body.appendChild(ghost);
  positionGhost(ghost, e.clientX, e.clientY);
  card.classList.add('dragging');
  dragState = { sourceWeekIdx: card.dataset.weekIdx, sourceIndex: card.dataset.dayIndex, sourceCard: card, ghost, lastTarget: null };
  e.currentTarget.setPointerCapture(e.pointerId);
  lastPointerY = e.clientY;
  if(!autoScrollRAF) autoScrollRAF = requestAnimationFrame(autoScrollTick);
}
function positionGhost(ghost, x, y){
  ghost.style.left = (x + 14) + 'px';
  ghost.style.top = (y - 40) + 'px';
}
let lastPointerY = 0;
let autoScrollRAF = null;
// Con più settimane il giorno di destinazione può essere fuori schermo: tenendo
// il dito vicino al bordo superiore/inferiore durante il trascinamento la pagina
// scorre da sola, come in una lista nativa con drag&drop.
function autoScrollTick(){
  if(!dragState){ autoScrollRAF = null; return; }
  const margin = 80, maxSpeed = 16;
  const vh = window.innerHeight;
  if(lastPointerY < margin){
    window.scrollBy(0, -maxSpeed * (1 - lastPointerY/margin));
  } else if(lastPointerY > vh - margin){
    window.scrollBy(0, maxSpeed * (1 - (vh - lastPointerY)/margin));
  }
  autoScrollRAF = requestAnimationFrame(autoScrollTick);
}
document.addEventListener('pointermove', e=>{
  if(!dragState) return;
  lastPointerY = e.clientY;
  positionGhost(dragState.ghost, e.clientX, e.clientY);
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const targetCard = el ? el.closest('.day-card') : null;
  if(dragState.lastTarget && dragState.lastTarget !== targetCard) dragState.lastTarget.classList.remove('drag-over');
  if(targetCard && targetCard !== dragState.sourceCard){
    targetCard.classList.add('drag-over');
    dragState.lastTarget = targetCard;
  } else {
    dragState.lastTarget = null;
  }
});
function endDayDrag(commit){
  if(!dragState) return;
  const { sourceWeekIdx, sourceIndex, sourceCard, ghost, lastTarget } = dragState;
  ghost.remove();
  sourceCard.classList.remove('dragging');
  if(lastTarget) lastTarget.classList.remove('drag-over');
  dragState = null;
  if(commit && lastTarget) swapDayRecipes(parseInt(sourceWeekIdx,10), sourceIndex, parseInt(lastTarget.dataset.weekIdx,10), lastTarget.dataset.dayIndex);
}
document.addEventListener('pointerup', ()=> endDayDrag(true));
document.addEventListener('pointercancel', ()=> endDayDrag(false));

(async function init(){
  await firebaseReady;
  await waitForAuth();
  await loadState();
  applyUserColors();
  if(DATA.forcedWeekBaseline && state.appliedForcedWeekVersion !== DATA.forcedWeekVersion){
    state.weekBaseline = DATA.forcedWeekBaseline;
    state.weekOverrides = {};
    state.weekOverridePicked = {};
    state.appliedForcedWeekVersion = DATA.forcedWeekVersion;
    persist();
  }
  // Una tantum: porta gli elementi del vecchio elenco statico (DATA.pantry)
  // nell'inventario editabile, così la Dispensa parte già popolata invece
  // che vuota. Il flag evita di rimetterceli se poi vengono rimossi a mano.
  if(!state.pantrySeeded){
    DATA.pantry.forEach(p=> upsertPantryItem(p.elemento, ''));
    state.pantrySeeded = true;
    persist();
  }
  // Una tantum: porta il contenuto dei vecchi 3 cassetti fissi del freezer
  // nell'inventario unico, con luogo "freezer" (porzioni/data/note testuali
  // non hanno più posto nel nuovo modello a quantità numerica).
  if(!state.freezerSeeded){
    if(state.freezer){
      Object.values(state.freezer).forEach(d=>{
        if(d && d.contenuto && d.contenuto.trim()) upsertPantryItem(d.contenuto, 'freezer');
      });
    }
    state.freezerSeeded = true;
    persist();
  }
  // Una tantum: passa dalla vecchia quantità testuale libera (es. "6-8
  // medie") al nuovo contatore numerico con stepper. Non essendoci un modo
  // sensato di convertire un testo descrittivo in un numero, le voci
  // esistenti partono da 1 (l'utente aggiusta col +/-) invece di sparire.
  // Include anche le vecchie voci del freezer (state.freezerItems, dalla
  // migrazione precedente), che confluiscono qui con luogo "freezer".
  if(!state.pantryQtyMigrated){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(it && typeof it.qty !== 'number'){
        state.pantryItems[key] = { nome: it.nome, qty: 1, luogo: it.luogo || 'dispensa' };
      }
    });
    if(state.freezerItems){
      Object.values(state.freezerItems).forEach(it=>{
        if(it && it.nome) upsertPantryItem(it.nome, 'freezer');
      });
    }
    state.pantryQtyMigrated = true;
    persist();
  }
  // Una tantum: il luogo "utility" è stato rimosso (resta solo come reparto
  // della spesa) — le voci di dispensa che lo usavano passano a "dispensa".
  if(!state.pantryUtilityLuogoMigrated){
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(it && it.luogo === 'utility') it.luogo = 'dispensa';
    });
    state.pantryUtilityLuogoMigrated = true;
    persist();
  }
  // Una tantum: anche il reparto "Utility" come categoria viene rimosso, sostituito
  // dal flag manuale "staple" (vedi isStaple) impostabile all'aggiunta/modifica in
  // Dispensa. Le voci già categorizzate a mano come Utility, o il cui nome
  // corrispondeva alle vecchie parole chiave utility, ricevono staple:true per non
  // perdere il comportamento "di solito ce l'ho già" nella lista della spesa.
  if(!state.pantryStapleMigrated){
    const OLD_UTILITY_KEYWORDS = ['peperoncino','sale','olio','pepe','aceto','zucchero','spezie','origano','rosmarino','timo','alloro','cannella','paprika','noce moscata'];
    Object.keys(state.pantryItems).forEach(key=>{
      const it = state.pantryItems[key];
      if(!it) return;
      const wasUtilityCat = it.cat === 'utility';
      if(wasUtilityCat || OLD_UTILITY_KEYWORDS.some(kw => key.includes(kw))) it.staple = true;
      if(wasUtilityCat) delete it.cat;
    });
    state.pantryStapleMigrated = true;
    persist();
  }
  const todayPos = findTodayPos();
  if(todayPos !== null) state.expandedDay = `0_${WEEK_DISPLAY_ORDER[todayPos]}`;
  render();
})();

(function(){
  const btn = document.getElementById('refresh-btn');
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    btn.disabled = true;
    btn.textContent = '↻ Aggiornamento…';
    try{
      if(window.caches && caches.keys){
        const keys = await caches.keys();
        await Promise.all(keys.map(k=>caches.delete(k)));
      }
      if(navigator.serviceWorker && navigator.serviceWorker.getRegistrations){
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister()));
      }
    }catch(e){ /* ignora: procedi comunque col reload forzato sotto */ }
    try{
      // Su iOS, aperta da "Aggiungi a Home", una normale navigazione può
      // restituire una copia cache di sistema anche a Cache API/SW già puliti.
      // cache:'reload' bypassa la cache in lettura ma aggiorna comunque quella
      // HTTP con la risposta fresca, così la navigazione qui sotto (verso lo
      // stesso identico URL) la trova già pronta invece di quella stantia.
      await Promise.all([
        fetch(window.location.pathname, { cache: 'reload' }),
        fetch('style.css', { cache: 'reload' }),
        fetch('app.js', { cache: 'reload' })
      ]);
    }catch(e){ /* ignora: il reload sotto tenta comunque */ }
    window.location.replace(window.location.pathname);
  });
})();
