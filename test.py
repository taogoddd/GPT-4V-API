import requests

# The URL of your local API
base_url = 'http://localhost:3000'

# Initialize the page
def new_page():
    response = requests.post(f'{base_url}/new_page')
    print('Create new page:', response.text)

# Send a message
def type_message(message):
    response = requests.post(
        f'{base_url}/text',
        json={'message': message}
    )
    print('Send message:', response.text)

# Upload an image
def upload_image(file_path):
    # This is a simplified version. For actual file upload, you need to use the files parameter in requests.
    response = requests.post(
        f'{base_url}/upload',
        json={'filePath': file_path}
    )
    print('Upload image:', response.text)

# click the send button
def send():
    response = requests.post(f'{base_url}/send')
    print('Click send:', response.text)

# Test the API
# create a new page if you want to start a new conversation
# new_page()
upload_image('<path to your image>')  # Upload an image (make sure to use the correct path)
type_message('Explain this image to me')  # Send a message
send()