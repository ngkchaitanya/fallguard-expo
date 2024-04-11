import React from 'react';
import {statusBar } from 'expo-status-bar';





import {  
         InnerContainer,  
         PageTitle, 
         SubTitle, 
         StyledFormArea, 
         StyledButton,
         ButtonText,
         Line,
         WelcomeContainer,
         WelcomeImage,
         Avatar
        } from './../components/styles';

const Welcome = () => {
    
    return (
        <StyledContainer>
            <StatusBar style="light" />
            <InnerContainer>
                
                    <WelcomeImage resizeMode="cover" source={require('./../assets/img/img2.png')} />

                    <WelcomeContainer>
                        <PageTitle welcome={true}>Welcome! Buddy</PageTitle>
                        <SubTitle welcome={true}>CALN</SubTitle>
                        <SubTitle welcome={true}>caln123@gmail.com</SubTitle>
                    <StyledFormArea>
                        <Avatar  resizeMode="cover" source={require('./../assets/img/img1.png')}/>
                        <Line />
                        
                        <StyledButton onPress={() => {}}>
                            <ButtonText>Logout</ButtonText>
                        </StyledButton>
                        
                    </StyledFormArea> 
                    </WelcomeContainer>
                
            </InnerContainer>
        </StyledContainer>
    );
};


export default Welcome;