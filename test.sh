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

ab -n 50000 -c 1000 -p ./post.json -T "application/json" "http://localhost:3000/entities/5225de50cad29c0838000001/channels/5225df72a837767e3a000001/publish" 
