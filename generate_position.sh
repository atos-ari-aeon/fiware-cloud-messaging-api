# /**
# 	* Copyright (C) 2013 ATOS
# 	*
# 	* Licensed under the Apache License, Version 2.0 (the "License");
# 	* you may not use this file except in compliance with the License.
# 	* You may obtain a copy of the License at
# 	*
# 	*         http://www.apache.org/licenses/LICENSE-2.0
# 	*
# 	* Unless required by applicable law or agreed to in writing, software
# 	* distributed under the License is distributed on an "AS IS" BASIS,
# 	* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# 	* See the License for the specific language governing permissions and
# 	* limitations under the License.
# 	*
# 	* Authors: Jose Gato Luis (jose.gato@atos.net)

# */

#!/bin/bash

if [ $# -eq 2 ] 
then

	echo "Sending mesage to $1"
else
	 echo "usage: ./generate_position publication_url number_messages"
	 exit 
fi

URL=$1
for i in `seq 1 $2`
do
TIME=`node currentTime.js`
LON=$(( RANDOM % 100 ))
LAT=$(( RANDOM % 100 ))
DEC1=$RANDOM
DEC2=$RANDOM
echo $LON $LAT

echo " { \"clientDate\":\"$TIME\", \"longitude\":\"$LON.$DEC1\", \"latitude\":\"$LAT.$DEC2\" } " > /tmp/location.json
ab -n 1 -c 1 -p /tmp/location.json -T "application/json" "$URL" > /dev/null
sleep 0.3
done

