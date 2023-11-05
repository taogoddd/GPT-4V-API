import requests

# The URL of your local API
base_url = 'http://localhost:3000'

# Initialize the page
def new_page(close_other_tabs=True):
    '''
    Create a new page. If close_others is True, close all other pages.
    '''
    response = requests.post(f'{base_url}/new_page', json={'closeOtherTabs': close_other_tabs})
    print('Create new page:', response.text)

def type_message(message):
    '''
    Type a message in the input box.
    '''
    response = requests.post(
        f'{base_url}/text',
        json={'message': message}
    )
    print('Send message:', response.text)

def upload_image(file_path):
    '''
    Upload an image to the server.
    '''
    response = requests.post(
        f'{base_url}/upload',
        json={'filePath': file_path}
    )
    print('Upload image:', response.text)

def send():
    '''
    Click the send button.
    '''
    response = requests.post(f'{base_url}/send')
    print('Click send:', response.text)

def new_chat():
    '''
    Create a new chat by clicking the new chat button.
    However the default model is GPT-3.5
    So it is recommended to use new_page() with close_others=True instead.
    '''
    response = requests.post(f'{base_url}/new_chat')
    print('Create new chat:', response.text)

# Test the API
# create a new page if you want to start a new conversation
# new_page(close_others=True)

new_page(close_other_tabs=True)
upload_image('./assets/example.png')  # Upload an image (make sure to use the correct path)
type_message('Explain this image to me')  # Send a message
send()