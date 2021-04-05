import cv2
import numpy as np
import argparse
import textwrap
import os
import os.path as osp
from pathlib import Path

def arg_parse():
    parser = argparse.ArgumentParser(description = 'Titan Rover Spectroscopy Code for Something', usage = ''' python3 main.py
                         \n\tpython3 main.py --images IMAGES
                         \n\tpython3 main.py --images IMAGES --destination DESTINATION
                         \n\tpython3 main.py --images IMAGES --destination DESTINATION --image_processing IMAGE_PROCESSING
                         ''', formatter_class = argparse.RawTextHelpFormatter)
    parser.add_argument('--images', dest = 'images', help = 'Image / Directory containing Images to perform modification',
                        default = 'imgs', type = str)
    parser.add_argument('--destination', dest='destination', help = 'Directory to stored processed images',
                        default = 'dest', type = str)
    parser.add_argument('--image_processing', dest = 'image_processing', help = textwrap.dedent('''\
                        Image Processing (contouring, thresholding, masking)
                        Contouring is outlining objects
                        Thresholding is turning the image into black and white with the objects outlined
                        Masking is highlighting the objects'''), default = 'contouring')
    return parser.parse_args()

def get_all_images_from_a_directory(images):
    imageList = [osp.join(osp.realpath('.'), images, img) for img in os.listdir(images)]
    return imageList

def get_one_image(images):
    imageList = []
    imageList.append(osp.join(osp.realpath('.'), images))
    return imageList

def get_directory_path():
    directory_path = Path(__file__).parent.absolute()
    return directory_path

def get_image_name(image_location, processing_type):
    image_name = image_location.split('/')[-1]
    image_name = image_name.split('.')
    image_name[0] += f'_{processing_type}'
    image_name = '.'.join(image_name)
    return image_name

def get_image(image_location):
    image = cv2.imread(image_location)
    return image

def get_hsv(image):
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    return hsv

def get_green_hsv_range():
    low_green_hsv_value = np.array([35, 0, 0])
    high_green_hsv_value = np.array([90, 255, 255])
    return low_green_hsv_value, high_green_hsv_value

def get_mask(hsv, low_hsv_value, high_hsv_value):
    mask = cv2.inRange(hsv, low_hsv_value, high_hsv_value)
    return mask

def apply_mask(image, mask):
    highlighted_objects = cv2.bitwise_and(image, image, mask=mask)
    return highlighted_objects

def get_grayscale_image(image):
    grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return grayscale_image

def apply_threshold(grayscale_image):
    binary_image = cv2.adaptiveThreshold(grayscale_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 115, 1)
    return binary_image

def get_contours_and_hierachy(threshold):
    contours, hierarchy = cv2.findContours(threshold, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    return contours, hierarchy

def draw_contours_on_image(image, contours):
    contoured_image = cv2.drawContours(image, contours, -1, (0,255,0), 3)
    return contoured_image

def get_window_title(processing_type):
    window_title = ''
    if processing_type == "None":
        window_title = "Original Fluoprescence Objects Image"
    elif processing_type == "contouring":
        window_title = 'Outlined Fluorescence Image'
    elif processing_type == "thresholding":
        window_title = 'Black and White Fluorescence Objects Image'
    elif processing_type == "masking":
        window_title = "Highlighted Fluorescence Objects Image"
    return window_title

def show_original_image(image):
    window_title = get_window_title("None")
    cv2.imshow(window_title, image)

def show_processed_image(processed_image, processing_type):
    window_title = get_window_title(processing_type)
    cv2.imshow(window_title, processed_image)

def write_to_destination_folder(path, processed_image_name, processed_image):
    cv2.imwrite(osp.join(path, processed_image_name), processed_image)

def apply_contouring_on_image(destination_path, processing_type):
    image = get_image(image_location)
    original_image = image.copy()
    hsv = get_hsv(image)
    low_green_hsv_value, high_green_hsv_value = get_green_hsv_range()
    green_mask = get_mask(hsv, low_green_hsv_value, high_green_hsv_value)
    fluorescence_objects = apply_mask(image, green_mask)
    grayscale_image = get_grayscale_image(fluorescence_objects)
    binary_image = apply_threshold(grayscale_image)
    contours, hierarchy = get_contours_and_hierachy(binary_image)
    contoured_image = draw_contours_on_image(image, contours)
    contoured_image_name = get_image_name(image_location, processing_type)
    show_original_image(original_image)
    show_processed_image(contoured_image, processing_type)
    write_to_destination_folder(destination_path, contoured_image_name, contoured_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def apply_binary_on_image(destination_path, processing_type):
    image = get_image(image_location)
    original_image = image.copy()
    hsv = get_hsv(image)
    low_green_hsv_value, high_green_hsv_value = get_green_hsv_range()
    green_mask = get_mask(hsv, low_green_hsv_value, high_green_hsv_value)
    fluorescence_objects = apply_mask(image, green_mask)
    grayscale_image = get_grayscale_image(fluorescence_objects)
    binary_image = apply_threshold(grayscale_image)
    binary_image_name = get_image_name(image_location, processing_type)
    show_original_image(original_image)
    show_processed_image(binary_image, processing_type)
    write_to_destination_folder(destination_path, binary_image_name, binary_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def apply_mask_on_image(destination_path, processing_type):
    image = get_image(image_location)
    original_image = image.copy()
    hsv = get_hsv(image)
    low_green_hsv_value, high_green_hsv_value = get_green_hsv_range()
    green_mask = get_mask(hsv, low_green_hsv_value, high_green_hsv_value)
    fluorescence_objects = apply_mask(image, green_mask)
    fluorescence_objects_name = get_image_name(image_location, processing_type)
    show_original_image(green_mask)
    show_processed_image(fluorescence_objects, processing_type)
    write_to_destination_folder(destination_path, fluorescence_objects_name, fluorescence_objects)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == '__main__':
    args = arg_parse()
    images = args.images
    destination = args.destination
    processing_type = args.image_processing
    try:
        imageList = get_all_images_from_a_directory(images)
    except NotADirectoryError:
        imageList = get_one_image(images)
    except FileNotFoundError:
        print (f'No file or directory with the name {images}')
        exit()
    destination_path = f'{get_directory_path()}' + f'/{destination}'  
    if processing_type == "contouring":
        for image_location in imageList:
            apply_contouring_on_image(destination_path, processing_type)
    elif processing_type == "thresholding":
        for image_location in imageList:
            apply_binary_on_image(destination_path, processing_type)
    elif processing_type == "masking":
        for image_location in imageList:
            apply_mask_on_image(destination_path, processing_type)
    else:
        print(f'Processing type either is misspelled or the inputted choice is none of the above')
        exit()