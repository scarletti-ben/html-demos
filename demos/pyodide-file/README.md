# TODO
- Add button to hide the sidebar


# Code

```python
from random import randint as roll

class Die:
    def __init__(self):
        self.lowest = 1
        self.highest = 6
    
    def get_value(self):
        return roll(self.lowest, self.highest)
    
die = Die()
value = die.get_value()
print(f"You rolled a {value}!")
```